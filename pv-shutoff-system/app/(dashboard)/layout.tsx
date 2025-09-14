'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  BarChart3, 
  FileSpreadsheet, 
  Gauge, 
  Home,
  LineChart,
  Settings,
  HelpCircle,
  Activity,
  Menu,
  X,
  Zap,
  Database,
  ChevronLeft
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: '首页', href: '/', icon: Home },
  { name: '数据大屏', href: '/dashboard', icon: BarChart3 },
  { name: '实验仿真', href: '/simulation', icon: LineChart },
  { name: '数据管理', href: '/files', icon: FileSpreadsheet },
  { name: '点动控制', href: '/control', icon: Gauge },
  { name: '设备管理', href: '/devices', icon: Database },
  { name: '设置', href: '/settings', icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-industrial-darker overflow-hidden">
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-industrial-dark border-r border-industrial-border transition-transform duration-300",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-industrial-border">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-2 bg-industrial-primary rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg font-semibold">PV Control</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md hover:bg-industrial-surface"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-industrial-primary text-white"
                      : "text-gray-400 hover:text-gray-100 hover:bg-industrial-surface"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Status */}
          <div className="p-4 border-t border-industrial-border">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-industrial-surface">
              <Activity className="w-5 h-5 text-industrial-success" />
              <div className="flex-1">
                <p className="text-sm font-medium">系统状态</p>
                <p className="text-xs text-gray-400">运行正常</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300",
        sidebarOpen ? "lg:ml-64" : "ml-0"
      )}>
        {/* Top Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-industrial-border bg-industrial-dark/95 backdrop-blur px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md hover:bg-industrial-surface"
          >
            {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div className="flex-1 flex items-center justify-between">
            <h1 className="text-lg font-semibold">
              {navigation.find(item => item.href === pathname)?.name || '光伏关断器实验数据管理系统'}
            </h1>
            
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-md hover:bg-industrial-surface">
                <HelpCircle className="w-5 h-5 text-gray-400" />
              </button>
              <div className="h-8 w-8 rounded-full bg-industrial-primary flex items-center justify-center text-sm font-medium">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}