// 用于预处理flows数据的工具脚本
// 这个脚本可以离线运行，生成预处理的数据文件

import { processFlowsData } from './dataProcessor.js';

// 如果你想要预处理完整的flows数据，可以运行这个函数
export const preprocessFlowsData = async () => {
    try {
        console.log('开始预处理flows数据...');
        
        // 导入完整数据
        const flowsModule = await import('../units/flows.js');
        const rawData = flowsModule.default || [];
        
        console.log(`原始数据: ${rawData.length} 条记录`);
        
        // 处理数据
        const processedData = processFlowsData(rawData);
        
        console.log(`处理后数据: ${processedData.length} 个时间点`);
        
        // 生成JavaScript文件内容
        const fileContent = `// 预处理的flows时间序列数据
// 自动生成于 ${new Date().toISOString()}
const processedFlowsData = ${JSON.stringify(processedData, null, 2)};

export default processedFlowsData;
`;
        
        // 这里你可以将内容保存到文件
        console.log('预处理完成！');
        console.log('数据概览:');
        console.log(`- 时间范围: ${processedData[0]?.time} ~ ${processedData[processedData.length - 1]?.time}`);
        console.log(`- 最大值: ${Math.max(...processedData.map(d => d.num))}`);
        console.log(`- 最小值: ${Math.min(...processedData.map(d => d.num))}`);
        
        return fileContent;
        
    } catch (error) {
        console.error('预处理失败:', error);
        throw error;
    }
};

// 示例：如何在浏览器控制台中运行预处理
// window.preprocessFlows = preprocessFlowsData;