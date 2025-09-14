'use client'

import { useState, useRef } from 'react'
import { 
  Upload, 
  Download, 
  FileSpreadsheet,
  Trash2,
  Eye,
  Filter,
  Search,
  FolderOpen,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  MoreVertical,
  Grid,
  List,
  X
} from 'lucide-react'
import * as XLSX from 'xlsx'

// 模拟文件数据
const mockFiles = [
  {
    id: '1',
    filename: '实验数据_2025_05_02.xlsx',
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    fileSize: 245760,
    uploadedBy: 'Admin',
    createdAt: '2025-05-02T14:22:56',
    status: 'completed',
    recordCount: 100,
    deviceAddress: 1,
    experimentId: 'exp-001'
  },
  {
    id: '2',
    filename: '电压测试记录_20250502.xlsx',
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    fileSize: 189440,
    uploadedBy: 'Admin',
    createdAt: '2025-05-02T13:15:20',
    status: 'completed',
    recordCount: 75,
    deviceAddress: 2,
    experimentId: 'exp-002'
  },
  {
    id: '3',
    filename: '功率分析报告.xlsx',
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    fileSize: 512000,
    uploadedBy: 'Engineer',
    createdAt: '2025-05-02T10:30:00',
    status: 'processing',
    recordCount: 200,
    deviceAddress: 3,
    experimentId: 'exp-003'
  }
]

// 文件大小格式化
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 文件表格行组件
function FileTableRow({ file, onView, onDownload, onDelete }: any) {
  const statusColors = {
    completed: 'text-industrial-success',
    processing: 'text-industrial-warning',
    failed: 'text-industrial-danger'
  }

  const statusIcons = {
    completed: <CheckCircle className="w-4 h-4" />,
    processing: <Clock className="w-4 h-4" />,
    failed: <XCircle className="w-4 h-4" />
  }

  return (
    <tr className="border-b border-industrial-border hover:bg-industrial-surface/50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <FileSpreadsheet className="w-5 h-5 text-industrial-primary" />
          <div>
            <p className="font-medium">{file.filename}</p>
            <p className="text-sm text-gray-400">实验ID: {file.experimentId}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm">{formatFileSize(file.fileSize)}</span>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm">{file.recordCount} 条</span>
      </td>
      <td className="px-6 py-4">
        <div className={`flex items-center gap-2 ${statusColors[file.status as keyof typeof statusColors]}`}>
          {statusIcons[file.status as keyof typeof statusIcons]}
          <span className="text-sm capitalize">{file.status}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm text-gray-400">{file.uploadedBy}</span>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm text-gray-400">
          {new Date(file.createdAt).toLocaleString('zh-CN')}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(file)}
            className="p-2 rounded-lg hover:bg-industrial-surface transition-colors"
            title="查看"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDownload(file)}
            className="p-2 rounded-lg hover:bg-industrial-surface transition-colors"
            title="下载"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(file)}
            className="p-2 rounded-lg hover:bg-industrial-surface transition-colors text-industrial-danger"
            title="删除"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default function FilesPage() {
  const [files, setFiles] = useState(mockFiles)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [selectedFile, setSelectedFile] = useState<any>(null)
  const [previewData, setPreviewData] = useState<any[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 处理文件上传
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)
        
        console.log('Parsed Excel data:', jsonData)
        
        // 创建新文件记录
        const newFile = {
          id: Date.now().toString(),
          filename: file.name,
          fileType: file.type,
          fileSize: file.size,
          uploadedBy: 'Admin',
          createdAt: new Date().toISOString(),
          status: 'completed' as const,
          recordCount: jsonData.length,
          deviceAddress: 1,
          experimentId: `exp-${Date.now()}`
        }
        
        setFiles([newFile, ...files])
        
        // 显示成功消息
        console.log('File uploaded successfully')
      } catch (error) {
        console.error('Error parsing Excel file:', error)
      }
    }
    reader.readAsArrayBuffer(file)
  }

  // 查看文件详情
  const handleView = (file: any) => {
    setSelectedFile(file)
    // 这里可以加载实际的文件数据
    // 模拟数据预览
    const mockData = Array.from({ length: 10 }, (_, i) => ({
      序号: i + 1,
      电流: (Math.random() * 2).toFixed(5),
      电压: (Math.random() * 2 + 19).toFixed(5),
      功率: (Math.random() * 30).toFixed(5),
      时间戳: new Date().toLocaleString('zh-CN'),
      设备地址: file.deviceAddress,
      设备类型: '未知'
    }))
    setPreviewData(mockData)
  }

  // 下载文件
  const handleDownload = (file: any) => {
    // 创建示例数据
    const data = Array.from({ length: 100 }, (_, i) => ({
      序号: i + 1,
      电流: (Math.random() * 2).toFixed(5),
      电压: (Math.random() * 2 + 19).toFixed(5),
      功率: (Math.random() * 30).toFixed(5),
      时间戳: new Date().toLocaleString('zh-CN'),
      设备地址: file.deviceAddress,
      设备类型: '未知'
    }))
    
    // 创建工作簿
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    
    // 下载文件
    XLSX.writeFile(wb, file.filename)
  }

  // 删除文件
  const handleDelete = (file: any) => {
    if (confirm(`确定要删除文件 "${file.filename}" 吗？`)) {
      setFiles(files.filter(f => f.id !== file.id))
    }
  }

  // 筛选文件
  const filteredFiles = files.filter(file => 
    file.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.experimentId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold">数据文件管理</h1>
        <p className="text-gray-400 mt-1">管理实验数据文件，支持Excel导入导出</p>
      </div>

      {/* 工具栏 */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索文件名或实验ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-industrial-surface border border-industrial-border rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-industrial-primary focus:border-transparent w-80"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-industrial-surface text-gray-300 hover:bg-industrial-border transition-all">
            <Filter className="w-4 h-4" />
            筛选
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-industrial-surface rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-industrial-primary text-white' : 'text-gray-400'}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-industrial-primary text-white' : 'text-gray-400'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-industrial-primary text-white hover:bg-industrial-primary/90 transition-all"
          >
            <Upload className="w-4 h-4" />
            上传文件
          </button>
        </div>
      </div>

      {/* 文件列表 */}
      {viewMode === 'list' ? (
        <div className="industrial-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>文件名</th>
                  <th>大小</th>
                  <th>记录数</th>
                  <th>状态</th>
                  <th>上传者</th>
                  <th>上传时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map(file => (
                  <FileTableRow
                    key={file.id}
                    file={file}
                    onView={handleView}
                    onDownload={handleDownload}
                    onDelete={handleDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFiles.map(file => (
            <div key={file.id} className="industrial-card">
              <div className="flex items-start justify-between mb-4">
                <FileSpreadsheet className="w-8 h-8 text-industrial-primary" />
                <button className="p-1 rounded hover:bg-industrial-surface">
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <h3 className="font-semibold mb-2 truncate">{file.filename}</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex justify-between">
                  <span>大小</span>
                  <span>{formatFileSize(file.fileSize)}</span>
                </div>
                <div className="flex justify-between">
                  <span>记录数</span>
                  <span>{file.recordCount} 条</span>
                </div>
                <div className="flex justify-between">
                  <span>上传时间</span>
                  <span>{new Date(file.createdAt).toLocaleDateString('zh-CN')}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-industrial-border">
                <button
                  onClick={() => handleView(file)}
                  className="flex-1 px-3 py-2 rounded bg-industrial-surface hover:bg-industrial-border transition-all text-sm"
                >
                  查看
                </button>
                <button
                  onClick={() => handleDownload(file)}
                  className="flex-1 px-3 py-2 rounded bg-industrial-primary text-white hover:bg-industrial-primary/90 transition-all text-sm"
                >
                  下载
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 文件预览模态框 */}
      {selectedFile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-industrial-dark rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-industrial-border">
              <h2 className="text-xl font-semibold">文件预览: {selectedFile.filename}</h2>
              <button
                onClick={() => {
                  setSelectedFile(null)
                  setPreviewData([])
                }}
                className="p-2 rounded-lg hover:bg-industrial-surface"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-auto max-h-[70vh]">
              <table className="data-table">
                <thead>
                  <tr>
                    {previewData.length > 0 && Object.keys(previewData[0]).map(key => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((value: any, i) => (
                        <td key={i}>{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}