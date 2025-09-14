const XLSX = require('xlsx')
const fs = require('fs')
const path = require('path')

// 生成示例数据
function generateSampleData(recordCount = 100) {
  const data = []
  const startTime = new Date('2025-05-02T14:22:56')
  
  for (let i = 0; i < recordCount; i++) {
    const timestamp = new Date(startTime.getTime() + i * 1000) // 每秒一条记录
    
    data.push({
      序号: i + 1,
      '电流 (A)': (Math.random() * 2 + 0.1).toFixed(5),
      '电压 (V)': (Math.random() * 2 + 19).toFixed(5),
      '功率 (W)': (Math.random() * 30 + 5).toFixed(5),
      时间戳: timestamp.toLocaleString('zh-CN'),
      设备地址: Math.floor(Math.random() * 4) + 1,
      设备类型: ['未知', '光伏关断器', '逆变器', '控制器'][Math.floor(Math.random() * 4)]
    })
  }
  
  return data
}

// 创建Excel文件
function createExcelFile(filename, data, metadata) {
  const wb = XLSX.utils.book_new()
  
  // 创建数据工作表
  const ws = XLSX.utils.json_to_sheet(data)
  
  // 添加元数据到工作表顶部
  if (metadata) {
    XLSX.utils.sheet_add_aoa(ws, [
      ['数据信息', metadata.info],
      []
    ], { origin: -1 })
  }
  
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
  
  // 写入文件
  const outputPath = path.join(__dirname, '..', 'data', filename)
  XLSX.writeFile(wb, outputPath)
  console.log(`Created: ${outputPath}`)
}

// 生成三个示例文件
function generateAllSampleFiles() {
  // 确保data目录存在
  const dataDir = path.join(__dirname, '..', 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  
  // 文件1: 基础实验数据
  const data1 = generateSampleData(100)
  createExcelFile('实验数据_2025_05_02.xlsx', data1, {
    info: `记录时间: ${new Date().toLocaleString('zh-CN')} | 设备地址: 1 | 设备类型: 光伏关断器 | 数据点数: 100`
  })
  
  // 文件2: 电压测试数据
  const data2 = generateSampleData(75).map(item => ({
    ...item,
    '电压 (V)': (parseFloat(item['电压 (V)']) + Math.sin(item.序号 / 10) * 2).toFixed(5)
  }))
  createExcelFile('电压测试记录_20250502.xlsx', data2, {
    info: `记录时间: ${new Date().toLocaleString('zh-CN')} | 设备地址: 2 | 设备类型: 逆变器 | 数据点数: 75`
  })
  
  // 文件3: 功率分析数据
  const data3 = generateSampleData(200).map(item => ({
    ...item,
    '功率 (W)': (parseFloat(item['功率 (W)']) * (1 + Math.random() * 0.5)).toFixed(5),
    效率: (85 + Math.random() * 10).toFixed(2) + '%'
  }))
  createExcelFile('功率分析报告.xlsx', data3, {
    info: `记录时间: ${new Date().toLocaleString('zh-CN')} | 设备地址: 3 | 设备类型: 控制器 | 数据点数: 200`
  })
  
  console.log('Sample data files generated successfully!')
}

// 运行生成器
if (require.main === module) {
  generateAllSampleFiles()
}

module.exports = { generateSampleData, createExcelFile }