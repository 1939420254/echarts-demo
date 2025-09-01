import React, { useState, useRef, useEffect, useCallback } from 'react';
import './Timeline.css';

const Timeline = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration] = useState(300); // 5分钟 = 300秒
    const [selectionStart, setSelectionStart] = useState(60); // 默认选择范围开始
    const [selectionEnd, setSelectionEnd] = useState(120); // 默认选择范围结束
    // 动态计算选择区域宽度
    const selectionWidth = selectionEnd - selectionStart;
    const [playbackPosition, setPlaybackPosition] = useState(60); // 播放时框选区域的位置
    const [isDragging, setIsDragging] = useState(null); // 'start', 'end', 'selection', null
    const [dragOffset, setDragOffset] = useState(0);
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const animationRef = useRef(null);

    // 生成固定的波形数据，只在组件初始化时生成一次
    const waveformData = useRef(null);

    if (!waveformData.current) {
        const points = 200;
        const data = [];
        // 使用固定的种子来生成一致的波形
        for (let i = 0; i < points; i++) {
            // 使用数学函数生成更自然的波形，而不是完全随机
            const baseWave = Math.sin(i * 0.1) * 0.3;
            const noise = Math.sin(i * 0.3) * 0.2 + Math.sin(i * 0.7) * 0.1;
            const height = Math.abs(baseWave + noise) + 0.1;
            data.push(Math.min(height, 0.9));
        }
        waveformData.current = data;
    }

    // 绘制波形
    const drawWaveform = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const { width, height } = canvas;

        ctx.clearRect(0, 0, width, height);

        const barWidth = width / waveformData.current.length;

        // 播放时使用playbackPosition，非播放时使用selectionStart
        const currentSelectionStart = isPlaying ? playbackPosition : selectionStart;
        const currentSelectionEnd = isPlaying ? playbackPosition + selectionWidth : selectionEnd;

        const selectionStartPos = (currentSelectionStart / duration) * width;
        const selectionEndPos = (currentSelectionEnd / duration) * width;

        waveformData.current.forEach((amplitude, index) => {
            const barHeight = amplitude * height * 0.8;
            const x = index * barWidth;
            const y = height - barHeight; // 底部对齐

            // 判断当前条是否在选择范围内
            const isInSelection = x >= selectionStartPos && x <= selectionEndPos;

            if (isInSelection) {
                ctx.fillStyle = '#ef4444'; // 选择区域用红色
            } else {
                ctx.fillStyle = '#9ca3af'; // 非选择区域用灰色
            }

            ctx.fillRect(x, y, barWidth - 1, barHeight);
        });

        // 绘制选择区域背景
        ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
        ctx.fillRect(selectionStartPos, 0, selectionEndPos - selectionStartPos, height);
    }, [duration, selectionStart, selectionEnd, isPlaying, playbackPosition, selectionWidth]);

    // 播放动画 - 移动框选区域
    const animate = useCallback(() => {
        if (isPlaying) {
            setPlaybackPosition(prev => {
                const nextPos = prev + 0.5; // 每帧移动0.5秒
                // 当到达右侧边界时，重新从左侧开始
                if (nextPos + selectionWidth >= duration) {
                    return 0; // 重新从最左侧开始
                }
                return nextPos;
            });
            animationRef.current = requestAnimationFrame(animate);
        }
    }, [isPlaying, selectionWidth, duration]);

    const togglePlay = () => {
        if (!isPlaying) {
            // 开始播放时，将playbackPosition设置为当前selectionStart
            setPlaybackPosition(selectionStart);
        } else {
            // 暂停时，将当前播放位置更新到选择区域
            setSelectionStart(playbackPosition);
            setSelectionEnd(playbackPosition + selectionWidth);
        }
        setIsPlaying(!isPlaying);
    };

    // 获取时间位置
    const getTimeFromPosition = useCallback((x) => {
        const canvas = canvasRef.current;
        if (!canvas) return 0;
        const progress = Math.max(0, Math.min(1, x / canvas.width));
        return progress * duration;
    }, [duration]);

    // 获取位置从时间
    const getPositionFromTime = useCallback((time) => {
        const canvas = canvasRef.current;
        if (!canvas) return 0;
        return (time / duration) * canvas.width;
    }, [duration]);

    // 鼠标移动事件
    const handleMouseMove = useCallback((e) => {
        if (!isDragging) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const time = getTimeFromPosition(x - dragOffset);

        if (isDragging === 'start') {
            // 拖拽开始位置，允许自定义宽度
            const newStart = Math.max(0, Math.min(time, selectionEnd - 1)); // 最小1秒宽度
            setSelectionStart(newStart);
        } else if (isDragging === 'end') {
            // 拖拽结束位置，允许自定义宽度
            const newEnd = Math.max(selectionStart + 1, Math.min(duration, time)); // 最小1秒宽度
            setSelectionEnd(newEnd);
        } else if (isDragging === 'selection') {
            // 拖拽整个选择区域，保持当前宽度
            const currentWidth = selectionEnd - selectionStart;
            const newStart = Math.max(0, Math.min(duration - currentWidth, time));
            setSelectionStart(newStart);
            setSelectionEnd(newStart + currentWidth);
        }
    }, [isDragging, getTimeFromPosition, dragOffset, duration, selectionStart, selectionEnd]);

    // 鼠标抬起事件
    const handleMouseUp = useCallback(() => {
        setIsDragging(null);
        setDragOffset(0);
    }, []);



    // 鼠标按下事件
    const handleMouseDown = (e) => {
        // 播放时不允许拖拽
        if (isPlaying) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;

        const startPos = getPositionFromTime(selectionStart);
        const endPos = getPositionFromTime(selectionEnd);

        // 判断点击的是哪个区域
        if (Math.abs(x - startPos) < 10) {
            setIsDragging('start');
            setDragOffset(x - startPos);
        } else if (Math.abs(x - endPos) < 10) {
            setIsDragging('end');
            setDragOffset(x - endPos);
        } else if (x >= startPos && x <= endPos) {
            setIsDragging('selection');
            setDragOffset(x - startPos);
        }
    };

    // 添加全局鼠标事件监听
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);

            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, handleMouseMove, handleMouseUp]);

    // 强制重新渲染手柄位置
    const [, forceUpdate] = useState({});

    useEffect(() => {
        drawWaveform();
        // 强制更新手柄位置
        forceUpdate({});
    }, [drawWaveform]);

    useEffect(() => {
        if (isPlaying) {
            animationRef.current = requestAnimationFrame(animate);
        } else {
            cancelAnimationFrame(animationRef.current);
        }

        return () => cancelAnimationFrame(animationRef.current);
    }, [isPlaying, animate]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // 生成时间刻度
    const generateTimeMarks = () => {
        const marks = [];
        const interval = 30; // 每30秒一个刻度
        for (let i = 0; i <= duration; i += interval) {
            marks.push(i);
        }
        return marks;
    };

    const timeMarks = generateTimeMarks();

    return (
        <div className="timeline-container">
            <div className="timeline-content">
                <button className="play-button" onClick={togglePlay}>
                    {isPlaying ? '⏸️' : '▶️'}
                </button>

                <div className="waveform-container" ref={containerRef}>
                    <canvas
                        ref={canvasRef}
                        width={800}
                        height={80}
                        onMouseDown={handleMouseDown}
                        className="waveform-canvas"
                    />

                    {/* 选择区域的拖拽手柄 */}
                    <div
                        className="selection-handle selection-start"
                        style={{
                            left: `${10 + ((isPlaying ? playbackPosition : selectionStart) / duration) * (canvasRef.current?.width || 800)}px`,
                            display: isPlaying ? 'none' : 'block' // 播放时隐藏拖拽手柄
                        }}
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            if (!isPlaying) {
                                setIsDragging('start');
                                setDragOffset(0);
                            }
                        }}
                    />
                    <div
                        className="selection-handle selection-end"
                        style={{
                            left: `${10 + ((isPlaying ? playbackPosition + selectionWidth : selectionEnd) / duration) * (canvasRef.current?.width || 800)}px`,
                            display: isPlaying ? 'none' : 'block' // 播放时隐藏拖拽手柄
                        }}
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            if (!isPlaying) {
                                setIsDragging('end');
                                setDragOffset(0);
                            }
                        }}
                    />

                    <div className="time-marks">
                        {timeMarks.map((time, index) => (
                            <div
                                key={index}
                                className="time-mark"
                                style={{ left: `${(time / duration) * 100}%` }}
                            >
                                <div className="time-tick"></div>
                                <span className="time-label">{formatTime(time)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Timeline;

