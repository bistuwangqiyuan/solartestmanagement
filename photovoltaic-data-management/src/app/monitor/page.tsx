"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loading } from "@/components/ui/loading"
import { 
  Activity, 
  Zap,
  AlertCircle,
  Battery,
  Cpu,
  Wifi,
  WifiOff,
  Play,
  Pause
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { format } from "date-fns"

interface DeviceStatus {
  address: number
  name: string
  type: string
  status: "online" | "offline"
  lastSeen: string
  voltage?: number
  current?: number
  power?: number
}

export default function MonitorPage() {
  const [devices, setDevices] = useState<DeviceStatus[]>([])
  const [isMonitoring, setIsMonitoring] = useState(true)
  const [loading, setLoading] = useState(true)
  const [updateTime, setUpdateTime] = useState(new Date())
  
  const supabase = createClient()

  useEffect(() => {
    // 初始化设备数据
    initializeDevices()
    
    // 设置实时更新
    let interval: NodeJS.Timeout
    if (isMonitoring) {
      interval = setInterval(() => {
        updateDeviceStatus()
        setUpdateTime(new Date())
      }, 5000) // 每5秒更新一次
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isMonitoring])

  const initializeDevices = async () => {
    try {
      // 获取所有设备
      const { data: devicesData } = await supabase
        .from("devices")
        .select("*")
        .order("device_address")

      // 获取最新的测试数据
      const { data: latestTests } = await supabase
        .from("test_records")
        .select("*")
        .order("test_date", { ascending: false })
        .limit(100)

      // 合并设备信息和最新数据
      const deviceMap = new Map<number, DeviceStatus>()
      
      // 先添加已注册的设备
      devicesData?.forEach(device => {
        deviceMap.set(device.device_address, {
          address: device.device_address,
          name: device.device_name,
          type: device.device_type || "未知",
          status: "offline",
          lastSeen: device.updated_at
        })
      })

      // 更新最新测试数据
      latestTests?.forEach(test => {
        if (test.device_address) {
          const existing = deviceMap.get(test.device_address)
          const isRecent = new Date(test.test_date).getTime() > Date.now() - 60000 // 1分钟内
          
          if (existing) {
            existing.status = isRecent ? "online" : "offline"
            existing.lastSeen = test.test_date
            existing.voltage = test.voltage || undefined
            existing.current = test.current || undefined
            existing.power = test.power || undefined
          } else {
            deviceMap.set(test.device_address, {
              address: test.device_address,
              name: `设备 ${test.device_address}`,
              type: test.device_type || "未知",
              status: isRecent ? "online" : "offline",
              lastSeen: test.test_date,
              voltage: test.voltage || undefined,
              current: test.current || undefined,
              power: test.power || undefined
            })
          }
        }
      })

      setDevices(Array.from(deviceMap.values()))
      setLoading(false)
    } catch (error) {
      console.error("Error initializing devices:", error)
      setLoading(false)
    }
  }

  const updateDeviceStatus = async () => {
    try {
      // 获取最近10秒的数据
      const tenSecondsAgo = new Date(Date.now() - 10000).toISOString()
      
      const { data: recentTests } = await supabase
        .from("test_records")
        .select("*")
        .gte("test_date", tenSecondsAgo)
        .order("test_date", { ascending: false })

      if (recentTests && recentTests.length > 0) {
        setDevices(prev => {
          const updated = [...prev]
          
          recentTests.forEach(test => {
            const index = updated.findIndex(d => d.address === test.device_address)
            if (index >= 0) {
              updated[index] = {
                ...updated[index],
                status: "online",
                lastSeen: test.test_date,
                voltage: test.voltage || updated[index].voltage,
                current: test.current || updated[index].current,
                power: test.power || updated[index].power
              }
            }
          })
          
          // 检查离线设备
          updated.forEach(device => {
            const lastSeenTime = new Date(device.lastSeen).getTime()
            if (Date.now() - lastSeenTime > 60000) { // 超过1分钟未更新
              device.status = "offline"
            }
          })
          
          return updated
        })
      }
    } catch (error) {
      console.error("Error updating device status:", error)
    }
  }

  const onlineCount = devices.filter(d => d.status === "online").length
  const offlineCount = devices.filter(d => d.status === "offline").length

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 flex items-center justify-center min-h-[600px]">
          <Loading size="lg" text="加载设备状态..." />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">实时监控</h1>
            <p className="text-muted-foreground mt-1">
              监控所有光伏关断器设备的实时状态
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              最后更新：{format(updateTime, "HH:mm:ss")}
            </div>
            <Button
              onClick={() => setIsMonitoring(!isMonitoring)}
              variant={isMonitoring ? "default" : "outline"}
            >
              {isMonitoring ? (
                <>
                  <Pause className="mr-2 h-4 w-4" />
                  暂停监控
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  开始监控
                </>
              )}
            </Button>
          </div>
        </div>

        {/* 状态概览 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">设备总数</p>
                  <p className="text-3xl font-bold mt-2">{devices.length}</p>
                </div>
                <Cpu className="h-8 w-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-success/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">在线设备</p>
                  <p className="text-3xl font-bold mt-2 text-success">{onlineCount}</p>
                </div>
                <Wifi className="h-8 w-8 text-success opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-error/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">离线设备</p>
                  <p className="text-3xl font-bold mt-2 text-error">{offlineCount}</p>
                </div>
                <WifiOff className="h-8 w-8 text-error opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 设备列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {devices.map((device) => (
            <Card 
              key={device.address}
              className={`transition-all duration-300 ${
                device.status === "online" 
                  ? "border-success/50 shadow-success/20" 
                  : "border-error/50 opacity-75"
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{device.name}</CardTitle>
                  <div className={`h-3 w-3 rounded-full animate-pulse ${
                    device.status === "online" ? "bg-success" : "bg-error"
                  }`} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">地址</span>
                  <span className="font-mono">{device.address}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">类型</span>
                  <span>{device.type}</span>
                </div>

                {device.status === "online" && (
                  <>
                    <div className="pt-2 border-t border-border space-y-2">
                      {device.voltage !== undefined && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            电压
                          </span>
                          <span className="font-mono">{device.voltage.toFixed(2)}V</span>
                        </div>
                      )}
                      
                      {device.current !== undefined && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Activity className="h-3 w-3" />
                            电流
                          </span>
                          <span className="font-mono">{device.current.toFixed(2)}A</span>
                        </div>
                      )}
                      
                      {device.power !== undefined && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Battery className="h-3 w-3" />
                            功率
                          </span>
                          <span className="font-mono">{device.power.toFixed(2)}W</span>
                        </div>
                      )}
                    </div>
                  </>
                )}

                <div className="pt-2 text-xs text-muted-foreground">
                  最后更新：{format(new Date(device.lastSeen), "MM-dd HH:mm:ss")}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 空状态 */}
        {devices.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">暂无设备数据</p>
              <p className="text-sm text-muted-foreground mt-2">
                请先导入测试数据或等待设备上线
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}