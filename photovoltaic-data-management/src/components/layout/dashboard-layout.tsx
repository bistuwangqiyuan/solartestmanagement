"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Database, 
  BarChart3, 
  Upload, 
  Settings,
  AlertCircle,
  FileSpreadsheet,
  Activity
} from "lucide-react"

interface DashboardLayoutProps {
  children: ReactNode
}

const navigation = [
  { name: "仪表盘", href: "/", icon: LayoutDashboard },
  { name: "数据管理", href: "/data", icon: Database },
  { name: "数据导入", href: "/import", icon: Upload },
  { name: "数据大屏", href: "/dashboard", icon: BarChart3 },
  { name: "实时监控", href: "/monitor", icon: Activity },
  { name: "报表分析", href: "/reports", icon: FileSpreadsheet },
  { name: "告警管理", href: "/alerts", icon: AlertCircle },
  { name: "系统设置", href: "/settings", icon: Settings },
]

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 z-40 h-16 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="flex h-full items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <span className="text-xl font-bold text-primary-foreground">PV</span>
                </div>
                <div className="absolute inset-0 rounded-lg bg-gradient-primary blur-lg opacity-50" />
              </div>
              <div>
                <h1 className="text-xl font-bold">光伏关断器数据管理系统</h1>
                <p className="text-xs text-muted-foreground">Photovoltaic Shutdown Data Management</p>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-muted-foreground">系统运行正常</span>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-sm text-muted-foreground">
              {new Date().toLocaleString('zh-CN')}
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* 侧边栏 */}
        <aside className="fixed left-0 top-16 bottom-0 w-64 border-r border-border bg-card/50 backdrop-blur">
          <nav className="space-y-1 p-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* 底部系统信息 */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-border p-4">
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>版本</span>
                <span className="font-mono">v1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span>数据库</span>
                <span className="flex items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-success" />
                  连接正常
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* 主内容区 */}
        <main className="flex-1 ml-64">
          <div className="min-h-[calc(100vh-4rem)] bg-grid">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}