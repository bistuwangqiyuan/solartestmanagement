"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Settings, Database, Bell, Shield, Palette } from "lucide-react"

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">系统设置</h1>
          <p className="text-muted-foreground mt-1">
            配置系统参数和个性化设置
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                数据设置
              </CardTitle>
              <CardDescription>
                配置数据保留期限和清理策略
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">测试数据保留天数</label>
                  <Input type="number" defaultValue="365" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">日志保留天数</label>
                  <Input type="number" defaultValue="90" className="mt-1" />
                </div>
              </div>
              <Button variant="outline">保存设置</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                告警设置
              </CardTitle>
              <CardDescription>
                配置告警阈值和通知方式
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">低电压告警阈值(V)</label>
                  <Input type="number" defaultValue="10" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">高电流告警阈值(A)</label>
                  <Input type="number" defaultValue="90" className="mt-1" />
                </div>
              </div>
              <Button variant="outline">保存设置</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                界面设置
              </CardTitle>
              <CardDescription>
                自定义系统界面和主题
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">界面自定义功能即将推出</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}