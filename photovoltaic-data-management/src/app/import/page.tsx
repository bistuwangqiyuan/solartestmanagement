"use client"

import { useState, useCallback } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loading } from "@/components/ui/loading"
import { 
  Upload, 
  FileSpreadsheet, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Download,
  Trash2,
  Eye
} from "lucide-react"
import * as XLSX from "xlsx"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"

interface ExcelData {
  序号: number
  "电流 (A)": number
  "电压 (V)": number
  "功率 (W)": number
  时间戳: string
  设备地址: number
  设备类型: string
}

interface FileInfo {
  name: string
  size: number
  recordCount: number
  status: "pending" | "processing" | "success" | "error"
  data?: ExcelData[]
  error?: string
}

export default function ImportPage() {
  const [files, setFiles] = useState<FileInfo[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null)
  const supabase = createClient()

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(e.target.files || [])
    
    uploadedFiles.forEach(file => {
      if (file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" && 
          file.type !== "application/vnd.ms-excel") {
        toast({
          title: "文件格式错误",
          description: `${file.name} 不是有效的Excel文件`,
          variant: "destructive"
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: "array" })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          const jsonData = XLSX.utils.sheet_to_json<ExcelData>(worksheet, { 
            raw: false,
            defval: null 
          })

          // 过滤掉前两行（标题和空行）
          const filteredData = jsonData.slice(2).filter(row => row.序号)

          const fileInfo: FileInfo = {
            name: file.name,
            size: file.size,
            recordCount: filteredData.length,
            status: "pending",
            data: filteredData
          }

          setFiles(prev => [...prev, fileInfo])
        } catch (error) {
          toast({
            title: "文件解析失败",
            description: `无法解析文件 ${file.name}`,
            variant: "destructive"
          })
        }
      }
      reader.readAsArrayBuffer(file)
    })
  }, [toast])

  const handleImport = async (fileInfo: FileInfo) => {
    if (!fileInfo.data) return

    setFiles(prev => prev.map(f => 
      f.name === fileInfo.name ? { ...f, status: "processing" } : f
    ))

    try {
      // 创建导入批次
      const { data: batch, error: batchError } = await supabase
        .from("import_batches")
        .insert({
          file_name: fileInfo.name,
          file_size: fileInfo.size,
          record_count: fileInfo.recordCount,
          status: "processing"
        })
        .select()
        .single()

      if (batchError) throw batchError

      // 准备数据
      const records = fileInfo.data.map(row => ({
        voltage: parseFloat(String(row["电压 (V)"] || 0)),
        current: parseFloat(String(row["电流 (A)"] || 0)),
        power: parseFloat(String(row["功率 (W)"] || 0)),
        device_address: parseInt(String(row.设备地址 || 0)),
        device_type: row.设备类型 || "未知",
        test_date: new Date(row.时间戳 || new Date()).toISOString(),
        import_id: batch.id,
        batch_id: batch.id,
        test_result: "合格" // 根据实际业务逻辑判断
      }))

      // 批量插入数据
      const { error: insertError } = await supabase
        .from("test_records")
        .insert(records)

      if (insertError) throw insertError

      // 更新批次状态
      await supabase
        .from("import_batches")
        .update({ 
          status: "completed",
          success_count: records.length 
        })
        .eq("id", batch.id)

      setFiles(prev => prev.map(f => 
        f.name === fileInfo.name ? { ...f, status: "success" } : f
      ))

      toast({
        title: "导入成功",
        description: `成功导入 ${records.length} 条数据`,
      })
    } catch (error) {
      setFiles(prev => prev.map(f => 
        f.name === fileInfo.name ? { ...f, status: "error", error: String(error) } : f
      ))

      toast({
        title: "导入失败",
        description: "数据导入过程中出现错误",
        variant: "destructive"
      })
    }
  }

  const handleBatchImport = async () => {
    setIsProcessing(true)
    const pendingFiles = files.filter(f => f.status === "pending")
    
    for (const file of pendingFiles) {
      await handleImport(file)
    }
    
    setIsProcessing(false)
  }

  const removeFile = (fileName: string) => {
    setFiles(prev => prev.filter(f => f.name !== fileName))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / 1048576).toFixed(1) + " MB"
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* 页面标题 */}
        <div>
          <h1 className="text-3xl font-bold">数据导入</h1>
          <p className="text-muted-foreground mt-1">
            从Excel文件批量导入光伏关断器测试数据
          </p>
        </div>

        {/* 文件上传区域 */}
        <Card>
          <CardHeader>
            <CardTitle>选择文件</CardTitle>
            <CardDescription>
              支持 .xlsx 和 .xls 格式的Excel文件，可同时选择多个文件
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-4">
                拖拽文件到此处或点击选择文件
              </p>
              <Input
                type="file"
                multiple
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button variant="outline" asChild>
                  <span>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    选择Excel文件
                  </span>
                </Button>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* 文件列表 */}
        {files.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>待导入文件</CardTitle>
              <Button 
                onClick={handleBatchImport} 
                disabled={isProcessing || files.every(f => f.status !== "pending")}
                variant="neon"
              >
                {isProcessing ? (
                  <>
                    <Loading className="mr-2 h-4 w-4" />
                    正在导入...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    批量导入
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>文件名</TableHead>
                    <TableHead>大小</TableHead>
                    <TableHead>记录数</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {files.map((file) => (
                    <TableRow key={file.name}>
                      <TableCell className="font-mono text-sm">{file.name}</TableCell>
                      <TableCell>{formatFileSize(file.size)}</TableCell>
                      <TableCell>{file.recordCount} 条</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {file.status === "pending" && (
                            <>
                              <AlertCircle className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">待导入</span>
                            </>
                          )}
                          {file.status === "processing" && (
                            <>
                              <Loading size="sm" />
                              <span className="text-sm text-primary">导入中</span>
                            </>
                          )}
                          {file.status === "success" && (
                            <>
                              <CheckCircle className="h-4 w-4 text-success" />
                              <span className="text-sm text-success">导入成功</span>
                            </>
                          )}
                          {file.status === "error" && (
                            <>
                              <XCircle className="h-4 w-4 text-error" />
                              <span className="text-sm text-error">导入失败</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {file.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setSelectedFile(file)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleImport(file)}
                              >
                                <Upload className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFile(file.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* 数据预览 */}
        {selectedFile && selectedFile.data && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>数据预览 - {selectedFile.name}</CardTitle>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedFile(null)}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto max-h-96 scrollbar-thin">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>序号</TableHead>
                      <TableHead>电压 (V)</TableHead>
                      <TableHead>电流 (A)</TableHead>
                      <TableHead>功率 (W)</TableHead>
                      <TableHead>设备地址</TableHead>
                      <TableHead>设备类型</TableHead>
                      <TableHead>时间戳</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedFile.data.slice(0, 10).map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.序号}</TableCell>
                        <TableCell className="font-mono">{row["电压 (V)"]}</TableCell>
                        <TableCell className="font-mono">{row["电流 (A)"]}</TableCell>
                        <TableCell className="font-mono">{row["功率 (W)"]}</TableCell>
                        <TableCell>{row.设备地址}</TableCell>
                        <TableCell>{row.设备类型}</TableCell>
                        <TableCell className="text-xs">{row.时间戳}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {selectedFile.data.length > 10 && (
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    ... 还有 {selectedFile.data.length - 10} 条数据
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}