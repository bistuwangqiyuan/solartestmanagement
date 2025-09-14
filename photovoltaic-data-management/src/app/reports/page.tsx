"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileSpreadsheet, Download, Calendar, TrendingUp } from "lucide-react"

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">报表分析</h1>
          <p className="text-muted-foreground mt-1">
            生成和查看各类数据分析报表
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                日报表
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                生成每日测试数据汇总报表
              </p>
              <Button className="w-full" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                生成日报
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                周报表
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                生成每周测试数据分析报表
              </p>
              <Button className="w-full" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                生成周报
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5" />
                月报表
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                生成月度综合分析报表
              </p>
              <Button className="w-full" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                生成月报
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            <FileSpreadsheet className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>报表功能正在开发中</p>
            <p className="text-sm mt-2">即将支持自定义报表模板和自动化报表生成</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}