"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Bell, CheckCircle, XCircle } from "lucide-react"

export default function AlertsPage() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">告警管理</h1>
          <p className="text-muted-foreground mt-1">
            查看和管理系统告警信息
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-error/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">未处理告警</p>
                  <p className="text-3xl font-bold mt-2 text-error">3</p>
                </div>
                <AlertCircle className="h-8 w-8 text-error opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-warning/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">处理中</p>
                  <p className="text-3xl font-bold mt-2 text-warning">1</p>
                </div>
                <Bell className="h-8 w-8 text-warning opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-success/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">已解决</p>
                  <p className="text-3xl font-bold mt-2 text-success">12</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>告警功能正在开发中</p>
            <p className="text-sm mt-2">即将支持自定义告警规则和实时通知</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}