"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loading, TableSkeleton } from "@/components/ui/loading"
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  Trash2,
  Edit,
  Eye,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { TestRecord } from "@/types/database"
import { toast } from "@/hooks/use-toast"
import { format } from "date-fns"

export default function DataPage() {
  const [records, setRecords] = useState<TestRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [selectedRecords, setSelectedRecords] = useState<string[]>([])
  
  const supabase = createClient()
  const pageSize = 20

  // 获取数据
  const fetchData = async () => {
    setLoading(true)
    try {
      // 获取总数
      const { count } = await supabase
        .from("test_records")
        .select("*", { count: "exact", head: true })

      setTotalCount(count || 0)
      setTotalPages(Math.ceil((count || 0) / pageSize))

      // 获取当前页数据
      const { data, error } = await supabase
        .from("test_records")
        .select("*")
        .order("test_date", { ascending: false })
        .range((currentPage - 1) * pageSize, currentPage * pageSize - 1)

      if (error) throw error
      setRecords(data || [])
    } catch (error) {
      toast({
        title: "数据加载失败",
        description: "无法获取测试记录",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [currentPage])

  // 搜索功能
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchData()
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("test_records")
        .select("*")
        .or(`device_type.ilike.%${searchTerm}%,device_address.eq.${parseInt(searchTerm) || 0}`)
        .order("test_date", { ascending: false })
        .limit(pageSize)

      if (error) throw error
      setRecords(data || [])
      setCurrentPage(1)
      setTotalPages(1)
    } catch (error) {
      toast({
        title: "搜索失败",
        description: "无法执行搜索操作",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // 删除记录
  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("test_records")
        .delete()
        .eq("id", id)

      if (error) throw error

      toast({
        title: "删除成功",
        description: "记录已成功删除"
      })
      
      fetchData()
    } catch (error) {
      toast({
        title: "删除失败",
        description: "无法删除记录",
        variant: "destructive"
      })
    }
  }

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRecords.length === 0) return

    try {
      const { error } = await supabase
        .from("test_records")
        .delete()
        .in("id", selectedRecords)

      if (error) throw error

      toast({
        title: "批量删除成功",
        description: `已删除 ${selectedRecords.length} 条记录`
      })
      
      setSelectedRecords([])
      fetchData()
    } catch (error) {
      toast({
        title: "批量删除失败",
        description: "无法删除选中的记录",
        variant: "destructive"
      })
    }
  }

  // 导出数据
  const handleExport = async () => {
    try {
      const { data, error } = await supabase
        .from("test_records")
        .select("*")
        .order("test_date", { ascending: false })

      if (error) throw error

      // 转换为CSV格式
      const headers = ["测试日期", "电压(V)", "电流(A)", "功率(W)", "设备地址", "设备类型", "测试结果"]
      const csvContent = [
        headers.join(","),
        ...(data || []).map(record => [
          format(new Date(record.test_date), "yyyy-MM-dd HH:mm:ss"),
          record.voltage,
          record.current,
          record.power,
          record.device_address,
          record.device_type,
          record.test_result
        ].join(","))
      ].join("\n")

      // 创建下载链接
      const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.download = `test_records_${format(new Date(), "yyyyMMdd_HHmmss")}.csv`
      link.click()

      toast({
        title: "导出成功",
        description: "数据已导出为CSV文件"
      })
    } catch (error) {
      toast({
        title: "导出失败",
        description: "无法导出数据",
        variant: "destructive"
      })
    }
  }

  const toggleSelectRecord = (id: string) => {
    setSelectedRecords(prev => 
      prev.includes(id) 
        ? prev.filter(recordId => recordId !== id)
        : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedRecords.length === records.length) {
      setSelectedRecords([])
    } else {
      setSelectedRecords(records.map(record => record.id))
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">数据管理</h1>
            <p className="text-muted-foreground mt-1">
              查看和管理所有光伏关断器测试数据
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              共 {totalCount} 条记录
            </span>
          </div>
        </div>

        {/* 操作栏 */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex gap-2">
                <Input
                  placeholder="搜索设备类型或地址..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="max-w-sm"
                />
                <Button onClick={handleSearch} variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  搜索
                </Button>
              </div>
              <div className="flex gap-2">
                {selectedRecords.length > 0 && (
                  <Button
                    onClick={handleBatchDelete}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    删除选中 ({selectedRecords.length})
                  </Button>
                )}
                <Button onClick={handleExport} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  导出数据
                </Button>
                <Button onClick={fetchData} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  刷新
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 数据表格 */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6">
                <TableSkeleton rows={10} columns={8} />
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <input
                          type="checkbox"
                          checked={selectedRecords.length === records.length && records.length > 0}
                          onChange={toggleSelectAll}
                          className="rounded border-border"
                        />
                      </TableHead>
                      <TableHead>测试日期</TableHead>
                      <TableHead>电压 (V)</TableHead>
                      <TableHead>电流 (A)</TableHead>
                      <TableHead>功率 (W)</TableHead>
                      <TableHead>设备地址</TableHead>
                      <TableHead>设备类型</TableHead>
                      <TableHead>测试结果</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedRecords.includes(record.id)}
                            onChange={() => toggleSelectRecord(record.id)}
                            className="rounded border-border"
                          />
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {format(new Date(record.test_date), "yyyy-MM-dd HH:mm:ss")}
                        </TableCell>
                        <TableCell className="font-mono">
                          {record.voltage?.toFixed(2) || "-"}
                        </TableCell>
                        <TableCell className="font-mono">
                          {record.current?.toFixed(2) || "-"}
                        </TableCell>
                        <TableCell className="font-mono">
                          {record.power?.toFixed(2) || "-"}
                        </TableCell>
                        <TableCell>{record.device_address || "-"}</TableCell>
                        <TableCell>{record.device_type || "-"}</TableCell>
                        <TableCell>
                          <span className={cn(
                            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                            record.test_result === "合格"
                              ? "bg-success/20 text-success"
                              : "bg-error/20 text-error"
                          )}>
                            {record.test_result || "未知"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {/* 查看详情 */}}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {/* 编辑 */}}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(record.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* 分页 */}
                <div className="flex items-center justify-between p-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    第 {currentPage} 页，共 {totalPages} 页
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}