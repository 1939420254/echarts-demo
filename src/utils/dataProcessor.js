// 数据处理工具函数
export const processFlowsData = (flowsData) => {
    // 按时间聚合数据
    const timeAggregation = {};

    flowsData.forEach(item => {
        const time = item.time;
        const count = item.count || 0;

        if (timeAggregation[time]) {
            timeAggregation[time] += count;
        } else {
            timeAggregation[time] = count;
        }
    });

    // 转换为数组并按时间排序
    const processedData = Object.entries(timeAggregation)
        .map(([time, num]) => ({
            time: parseInt(time),
            num: num
        }))
        .sort((a, b) => a.time - b.time);

    return processedData;
};

// 将处理后的数据转换为波形数据
export const convertToWaveformData = (processedData, targetPoints = 200) => {
    if (!processedData || processedData.length === 0) {
        return [];
    }

    const minTime = processedData[0].time;
    const maxTime = processedData[processedData.length - 1].time;
    const timeRange = maxTime - minTime;

    // 找到最大值用于归一化
    const maxNum = Math.max(...processedData.map(d => d.num));

    // 生成目标点数的波形数据
    const waveformData = [];

    for (let i = 0; i < targetPoints; i++) {
        const currentTime = minTime + (timeRange * i / (targetPoints - 1));

        // 找到最接近的数据点
        let closestData = processedData[0];
        let minDistance = Math.abs(currentTime - closestData.time);

        for (const data of processedData) {
            const distance = Math.abs(currentTime - data.time);
            if (distance < minDistance) {
                minDistance = distance;
                closestData = data;
            }
        }

        // 归一化到 0-1 范围
        const normalizedValue = closestData.num / maxNum;
        waveformData.push(normalizedValue);
    }

    return waveformData;
};

// 获取时间范围信息
export const getTimeRange = (processedData) => {
    if (!processedData || processedData.length === 0) {
        return { minTime: 0, maxTime: 100, duration: 100 };
    }

    const minTime = processedData[0].time;
    const maxTime = processedData[processedData.length - 1].time;
    const duration = maxTime - minTime;

    return { minTime, maxTime, duration };
};