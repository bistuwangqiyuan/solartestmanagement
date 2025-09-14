"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DataCard } from "@/components/ui/card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Activity, 
  Database, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Zap
} from "lucide-react"

export default function Home() {
  // 模拟数据 - 实际应用中应从Supabase获取
  const stats = {
    todayTests: 156,
    passRate: 94.2,
    avgPower: 245.8,
    activeDevices: 12,
    totalRecords: 15420,
    monthlyGrowth: 12.5,
    alerts: 3,
    avgTestTime: 45
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">系统概览</h1>
            <p className="text-muted-foreground mt-1">
              实时监控光伏关断器测试数据和系统状态
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Clock className="mr-2 h-4 w-4" />
              最近24小时
            </Button>
            <Button variant="neon">
              <Activity className="mr-2 h-4 w-4" />
              实时刷新
            </Button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DataCard
            title="今日测试数"
            value={stats.todayTests}
            unit="次"
            trend="up"
            trendValue="+12.5%"
          />
          <DataCard
            title="合格率"
            value={stats.passRate}
            unit="%"
            trend="up"
            trendValue="+2.3%"
          />
          <DataCard
            title="平均功率"
            value={stats.avgPower}
            unit="W"
            trend="neutral"
            trendValue="±0.5%"
          />
          <DataCard
            title="在线设备"
            value={stats.activeDevices}
            unit="台"
            trend="up"
            trendValue="+2台"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 测试状态分布 */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                测试状态分布
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Zap className="h-12 w-12 mx-auto mb-4 text-primary/50" />
                  <p>图表组件将在后续开发中实现</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 系统状态 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                系统状态
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-success/10 border border-success/20">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-sm">数据库连接</span>
                </div>
                <span className="text-xs text-success">正常</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-success/10 border border-success/20">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-sm">数据采集服务</span>
                </div>
                <span className="text-xs text-success">运行中</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-warning/10 border border-warning/20">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-warning" />
                  <span className="text-sm">待处理告警</span>
                </div>
                <span className="text-xs text-warning">{stats.alerts} 条</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-success/10 border border-success/20">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-sm">系统负载</span>
                </div>
                <span className="text-xs text-success">15%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 快速操作 */}
        <Card>
          <CardHeader>
            <CardTitle>快速操作</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Database className="h-6 w-6" />
                <span className="text-xs">查看数据</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <TrendingUp className="h-6 w-6" />
                <span className="text-xs">生成报表</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <AlertCircle className="h-6 w-6" />
                <span className="text-xs">查看告警</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Activity className="h-6 w-6" />
                <span className="text-xs">实时监控</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}