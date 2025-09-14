"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loading } from "@/components/ui/loading"
import { 
  Activity, 
  TrendingUp, 
  Zap,
  AlertCircle,
  BarChart3,
  Battery,
  Cpu,
  Timer
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { format } from "date-fns"

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalTests: 0,
    todayTests: 0,
    passRate: 0,
    avgVoltage: 0,
    avgCurrent: 0,
    avgPower: 0,
    maxPower: 0,
    minPower: 0,
    activeDevices: 0,
    recentAlerts: 0
  })
  const [realtimeData, setRealtimeData] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    fetchDashboardData()
    
    // 设置定时刷新
    const interval = setInterval(fetchDashboardData, 30000) // 每30秒刷新
    
    return () => clearInterval(interval)
  }, [])

  const fetchDashboardData = async () => {
    try {
      // 获取今日统计
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const { data: todayData, count: todayCount } = await supabase
        .from("test_records")
        .select("*", { count: "exact" })
        .gte("test_date", today.toISOString())

      // 获取总体统计
      const { data: allData, count: totalCount } = await supabase
        .from("test_records")
        .select("*", { count: "exact" })

      // 计算统计数据
      if (allData && allData.length > 0) {
        const validData = allData.filter(d => d.voltage && d.current && d.power)
        const passedTests = allData.filter(d => d.test_result === "合格").length
        
        setStats({
          totalTests: totalCount || 0,
          todayTests: todayCount || 0,
          passRate: totalCount ? (passedTests / totalCount * 100) : 0,
          avgVoltage: validData.reduce((sum, d) => sum + (d.voltage || 0), 0) / validData.length,
          avgCurrent: validData.reduce((sum, d) => sum + (d.current || 0), 0) / validData.length,
          avgPower: validData.reduce((sum, d) => sum + (d.power || 0), 0) / validData.length,
          maxPower: Math.max(...validData.map(d => d.power || 0)),
          minPower: Math.min(...validData.map(d => d.power || 0)),
          activeDevices: new Set(allData.map(d => d.device_address)).size,
          recentAlerts: 3 // 模拟数据
        })
      }

      // 获取最近的测试数据（用于实时展示）
      const { data: recentData } = await supabase
        .from("test_records")
        .select("*")
        .order("test_date", { ascending: false })
        .limit(10)

      setRealtimeData(recentData || [])
      setLoading(false)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loading size="lg" text="加载数据大屏..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      {/* 顶部标题栏 */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary text-glow mb-2">
          光伏关断器数据监控大屏
        </h1>
        <p className="text-muted-foreground">
          实时更新时间：{format(new Date(), "yyyy-MM-dd HH:mm:ss")}
        </p>
      </div>

      {/* 关键指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">今日测试</p>
                <p className="text-3xl font-bold font-mono mt-2">{stats.todayTests}</p>
                <p className="text-xs text-success mt-1">+12.5%</p>
              </div>
              <Activity className="h-12 w-12 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-success/20 bg-gradient-to-br from-success/10 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">合格率</p>
                <p className="text-3xl font-bold font-mono mt-2">{stats.passRate.toFixed(1)}%</p>
                <p className="text-xs text-success mt-1">优秀</p>
              </div>
              <TrendingUp className="h-12 w-12 text-success opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-warning/20 bg-gradient-to-br from-warning/10 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">平均功率</p>
                <p className="text-3xl font-bold font-mono mt-2">{stats.avgPower.toFixed(1)}W</p>
                <p className="text-xs text-muted-foreground mt-1">稳定</p>
              </div>
              <Zap className="h-12 w-12 text-warning opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-info/20 bg-gradient-to-br from-info/10 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">活跃设备</p>
                <p className="text-3xl font-bold font-mono mt-2">{stats.activeDevices}</p>
                <p className="text-xs text-info mt-1">在线</p>
              </div>
              <Cpu className="h-12 w-12 text-info opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 中部图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* 功率分布图 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              功率分布统计
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border border-border rounded-lg bg-card/50">
              <div className="text-center text-muted-foreground">
                <Battery className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>图表组件开发中</p>
                <p className="text-sm mt-2">
                  功率范围：{stats.minPower.toFixed(1)}W - {stats.maxPower.toFixed(1)}W
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 设备状态 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              系统状态
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-success/10 border border-success/20">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">数据采集</span>
                <span className="text-xs text-success">正常</span>
              </div>
              <div className="mt-2 h-2 bg-background rounded-full overflow-hidden">
                <div className="h-full bg-success animate-pulse" style={{ width: "100%" }} />
              </div>
            </div>

            <div className="p-4 rounded-lg bg-info/10 border border-info/20">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">系统负载</span>
                <span className="text-xs text-info">15%</span>
              </div>
              <div className="mt-2 h-2 bg-background rounded-full overflow-hidden">
                <div className="h-full bg-info" style={{ width: "15%" }} />
              </div>
            </div>

            <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">待处理告警</span>
                <span className="text-xs text-warning">{stats.recentAlerts} 条</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 底部实时数据 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-primary" />
            实时测试数据
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-2 text-muted-foreground">时间</th>
                  <th className="text-left p-2 text-muted-foreground">设备</th>
                  <th className="text-right p-2 text-muted-foreground">电压(V)</th>
                  <th className="text-right p-2 text-muted-foreground">电流(A)</th>
                  <th className="text-right p-2 text-muted-foreground">功率(W)</th>
                  <th className="text-center p-2 text-muted-foreground">状态</th>
                </tr>
              </thead>
              <tbody>
                {realtimeData.map((record, index) => (
                  <tr key={record.id} className="border-b border-border/50 animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}>
                    <td className="p-2 font-mono text-xs">
                      {format(new Date(record.test_date), "HH:mm:ss")}
                    </td>
                    <td className="p-2">{record.device_type || "未知"}-{record.device_address}</td>
                    <td className="p-2 text-right font-mono">{record.voltage?.toFixed(2) || "-"}</td>
                    <td className="p-2 text-right font-mono">{record.current?.toFixed(2) || "-"}</td>
                    <td className="p-2 text-right font-mono">{record.power?.toFixed(2) || "-"}</td>
                    <td className="p-2 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        record.test_result === "合格" 
                          ? "bg-success/20 text-success" 
                          : "bg-error/20 text-error"
                      }`}>
                        {record.test_result || "未知"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}