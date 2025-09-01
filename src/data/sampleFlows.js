// 轻量级示例数据，模拟flows数据结构
const sampleFlowsData = [
    // 1999年数据
    { origin: 1, dest: 2, count: 42, time: 1999 },
    { origin: 1, dest: 3, count: 137, time: 1999 },
    { origin: 2, dest: 1, count: 43, time: 1999 },
    { origin: 2, dest: 3, count: 34, time: 1999 },
    { origin: 3, dest: 1, count: 136, time: 1999 },
    { origin: 3, dest: 2, count: 21, time: 1999 },
    
    // 2000年数据
    { origin: 1, dest: 2, count: 55, time: 2000 },
    { origin: 1, dest: 3, count: 164, time: 2000 },
    { origin: 2, dest: 1, count: 87, time: 2000 },
    { origin: 2, dest: 3, count: 78, time: 2000 },
    { origin: 3, dest: 1, count: 198, time: 2000 },
    { origin: 3, dest: 2, count: 45, time: 2000 },
    
    // 2001年数据
    { origin: 1, dest: 2, count: 123, time: 2001 },
    { origin: 1, dest: 3, count: 234, time: 2001 },
    { origin: 2, dest: 1, count: 167, time: 2001 },
    { origin: 2, dest: 3, count: 156, time: 2001 },
    { origin: 3, dest: 1, count: 267, time: 2001 },
    { origin: 3, dest: 2, count: 89, time: 2001 },
    
    // 2002年数据
    { origin: 1, dest: 2, count: 145, time: 2002 },
    { origin: 1, dest: 3, count: 289, time: 2002 },
    { origin: 2, dest: 1, count: 234, time: 2002 },
    { origin: 2, dest: 3, count: 178, time: 2002 },
    { origin: 3, dest: 1, count: 345, time: 2002 },
    { origin: 3, dest: 2, count: 156, time: 2002 },
    
    // 2003年数据
    { origin: 1, dest: 2, count: 178, time: 2003 },
    { origin: 1, dest: 3, count: 312, time: 2003 },
    { origin: 2, dest: 1, count: 289, time: 2003 },
    { origin: 2, dest: 3, count: 201, time: 2003 },
    { origin: 3, dest: 1, count: 398, time: 2003 },
    { origin: 3, dest: 2, count: 187, time: 2003 },
    
    // 2004年数据
    { origin: 1, dest: 2, count: 201, time: 2004 },
    { origin: 1, dest: 3, count: 356, time: 2004 },
    { origin: 2, dest: 1, count: 334, time: 2004 },
    { origin: 2, dest: 3, count: 223, time: 2004 },
    { origin: 3, dest: 1, count: 445, time: 2004 },
    { origin: 3, dest: 2, count: 212, time: 2004 },
    
    // 2005年数据
    { origin: 1, dest: 2, count: 234, time: 2005 },
    { origin: 1, dest: 3, count: 398, time: 2005 },
    { origin: 2, dest: 1, dest: 378, time: 2005 },
    { origin: 2, dest: 3, count: 245, time: 2005 },
    { origin: 3, dest: 1, count: 489, time: 2005 },
    { origin: 3, dest: 2, count: 234, time: 2005 },
    
    // 2006年数据
    { origin: 1, dest: 2, count: 267, time: 2006 },
    { origin: 1, dest: 3, count: 423, time: 2006 },
    { origin: 2, dest: 1, count: 412, time: 2006 },
    { origin: 2, dest: 3, count: 278, time: 2006 },
    { origin: 3, dest: 1, count: 534, time: 2006 },
    { origin: 3, dest: 2, count: 267, time: 2006 },
    
    // 2007年数据
    { origin: 1, dest: 2, count: 298, time: 2007 },
    { origin: 1, dest: 3, count: 456, time: 2007 },
    { origin: 2, dest: 1, count: 445, time: 2007 },
    { origin: 2, dest: 3, count: 312, time: 2007 },
    { origin: 3, dest: 1, count: 578, time: 2007 },
    { origin: 3, dest: 2, count: 289, time: 2007 },
    
    // 2008年数据
    { origin: 1, dest: 2, count: 334, time: 2008 },
    { origin: 1, dest: 3, count: 489, time: 2008 },
    { origin: 2, dest: 1, count: 478, time: 2008 },
    { origin: 2, dest: 3, count: 345, time: 2008 },
    { origin: 3, dest: 1, count: 623, time: 2008 },
    { origin: 3, dest: 2, count: 312, time: 2008 },
    
    // 2009年数据
    { origin: 1, dest: 2, count: 367, time: 2009 },
    { origin: 1, dest: 3, count: 523, time: 2009 },
    { origin: 2, dest: 1, count: 512, time: 2009 },
    { origin: 2, dest: 3, count: 378, time: 2009 },
    { origin: 3, dest: 1, count: 667, time: 2009 },
    { origin: 3, dest: 2, count: 334, time: 2009 },
    
    // 2010年数据
    { origin: 1, dest: 2, count: 398, time: 2010 },
    { origin: 1, dest: 3, count: 556, time: 2010 },
    { origin: 2, dest: 1, count: 545, time: 2010 },
    { origin: 2, dest: 3, count: 412, time: 2010 },
    { origin: 3, dest: 1, count: 712, time: 2010 },
    { origin: 3, dest: 2, count: 367, time: 2010 }
];

export default sampleFlowsData;