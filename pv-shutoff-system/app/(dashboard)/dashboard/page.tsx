'use client'

import { useState, useEffect } from 'react'
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area,
  BarChart, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Battery,
  Gauge,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'

// 模拟实时数据
const generateRealtimeData = () => {
  return {
    timestamp: new Date().toLocaleTimeString('zh-CN'),
    current: Math.random() * 2 + 0.5,
    voltage: Math.random() * 2 + 19,
    power: Math.random() * 10 + 15,
  }
}

// 仪表板卡片组件
function MetricCard({ 
  title, 
  value, 
  unit, 
  change, 
  trend, 
  icon: Icon,
  color = 'primary' 
}: {
  title: string
  value: string | number
  unit?: string
  change?: string
  trend?: 'up' | 'down'
  icon: any
  color?: 'primary' | 'success' | 'warning' | 'danger'
}) {
  const colorClasses = {
    primary: 'bg-industrial-primary/20 text-industrial-primary border-industrial-primary/30',
    success: 'bg-industrial-success/20 text-industrial-success border-industrial-success/30',
    warning: 'bg-industrial-warning/20 text-industrial-warning border-industrial-warning/30',
    danger: 'bg-industrial-danger/20 text-industrial-danger border-industrial-danger/30',
  }

  return (
    <div className="industrial-card">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {change && (
          <div className="flex items-center gap-1 text-sm">
            {trend === 'up' ? (
              <TrendingUp className="w-4 h-4 text-industrial-success" />
            ) : (
              <TrendingDown className="w-4 h-4 text-industrial-danger" />
            )}
            <span className={trend === 'up' ? 'text-industrial-success' : 'text-industrial-danger'}>
              {change}
            </span>
          </div>
        )}
      </div>
      <p className="text-gray-400 text-sm mb-1">{title}</p>
      <p className="text-2xl font-bold">
        {value}
        {unit && <span className="text-lg text-gray-400 ml-1">{unit}</span>}
      </p>
    </div>
  )
}

export default function DashboardPage() {
  const [realtimeData, setRealtimeData] = useState<any[]>([])
  const [currentMetrics, setCurrentMetrics] = useState({
    current: 0,
    voltage: 0,
    power: 0,
  })

  // 模拟实时数据更新
  useEffect(() => {
    const interval = setInterval(() => {
      const newData = generateRealtimeData()
      setRealtimeData(prev => {
        const updated = [...prev, newData]
        return updated.slice(-20) // 保留最近20个数据点
      })
      setCurrentMetrics({
        current: parseFloat(newData.current.toFixed(3)),
        voltage: parseFloat(newData.voltage.toFixed(3)),
        power: parseFloat(newData.power.toFixed(3)),
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // 设备状态数据
  const deviceStatus = [
    { name: '运行中', value: 18, color: '#22C55E' },
    { name: '待机', value: 4, color: '#F59E0B' },
    { name: '维护', value: 2, color: '#EF4444' },
  ]

  // 每日统计数据
  const dailyStats = [
    { time: '00:00', experiments: 12, dataPoints: 15420 },
    { time: '04:00', experiments: 8, dataPoints: 10280 },
    { time: '08:00', experiments: 25, dataPoints: 32150 },
    { time: '12:00', experiments: 35, dataPoints: 45010 },
    { time: '16:00', experiments: 28, dataPoints: 36020 },
    { time: '20:00', experiments: 20, dataPoints: 25720 },
  ]

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold">数据监控大屏</h1>
        <p className="text-gray-400 mt-1">实时监控系统运行状态和关键性能指标</p>
      </div>

      {/* 核心指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="当前电流"
          value={currentMetrics.current}
          unit="A"
          change="+2.5%"
          trend="up"
          icon={Zap}
          color="primary"
        />
        <MetricCard
          title="当前电压"
          value={currentMetrics.voltage}
          unit="V"
          change="-0.8%"
          trend="down"
          icon={Battery}
          color="success"
        />
        <MetricCard
          title="实时功率"
          value={currentMetrics.power}
          unit="W"
          change="+5.2%"
          trend="up"
          icon={Gauge}
          color="warning"
        />
        <MetricCard
          title="系统效率"
          value="98.5"
          unit="%"
          change="+0.3%"
          trend="up"
          icon={Activity}
          color="danger"
        />
      </div>

      {/* 实时曲线图 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="industrial-card">
          <h3 className="text-lg font-semibold mb-4">电流/电压实时曲线</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={realtimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="timestamp" 
                  stroke="#94A3B8"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="#94A3B8"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E293B', 
                    border: '1px solid #334155',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="current" 
                  stroke="#0EA5E9" 
                  strokeWidth={2}
                  dot={false}
                  name="电流 (A)"
                />
                <Line 
                  type="monotone" 
                  dataKey="voltage" 
                  stroke="#22C55E" 
                  strokeWidth={2}
                  dot={false}
                  name="电压 (V)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="industrial-card">
          <h3 className="text-lg font-semibold mb-4">功率输出曲线</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={realtimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="timestamp" 
                  stroke="#94A3B8"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="#94A3B8"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E293B', 
                    border: '1px solid #334155',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="power" 
                  stroke="#F59E0B"
                  fill="url(#powerGradient)"
                  strokeWidth={2}
                  name="功率 (W)"
                />
                <defs>
                  <linearGradient id="powerGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 设备状态和统计 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="industrial-card">
          <h3 className="text-lg font-semibold mb-4">设备状态分布</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deviceStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E293B', 
                    border: '1px solid #334155',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {deviceStatus.map((status) => (
              <div key={status.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }} />
                  <span className="text-sm text-gray-400">{status.name}</span>
                </div>
                <span className="text-sm font-medium">{status.value} 台</span>
              </div>
            ))}
          </div>
        </div>

        <div className="industrial-card lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">今日实验统计</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="time" 
                  stroke="#94A3B8"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="#94A3B8"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E293B', 
                    border: '1px solid #334155',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="experiments" fill="#0EA5E9" name="实验次数" />
                <Bar dataKey="dataPoints" fill="#22C55E" name="数据点数" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 系统状态 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="industrial-card flex items-center gap-4">
          <CheckCircle className="w-8 h-8 text-industrial-success" />
          <div>
            <p className="text-sm text-gray-400">数据采集</p>
            <p className="font-semibold">正常运行</p>
          </div>
        </div>
        <div className="industrial-card flex items-center gap-4">
          <Clock className="w-8 h-8 text-industrial-warning" />
          <div>
            <p className="text-sm text-gray-400">最后更新</p>
            <p className="font-semibold">{new Date().toLocaleTimeString('zh-CN')}</p>
          </div>
        </div>
        <div className="industrial-card flex items-center gap-4">
          <AlertCircle className="w-8 h-8 text-industrial-info" />
          <div>
            <p className="text-sm text-gray-400">告警数量</p>
            <p className="font-semibold">0 个</p>
          </div>
        </div>
      </div>
    </div>
  )
}