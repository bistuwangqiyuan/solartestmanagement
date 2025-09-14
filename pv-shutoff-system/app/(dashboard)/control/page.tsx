'use client'

import { useState, useEffect } from 'react'
import { 
  Power, 
  Zap, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Activity,
  Gauge,
  Timer,
  Lock,
  Unlock,
  TrendingUp,
  Lightbulb,
  ShieldCheck
} from 'lucide-react'

// 控制按钮组件
function ControlButton({ 
  label, 
  isActive, 
  onClick, 
  disabled = false,
  color = 'primary' 
}: {
  label: string
  isActive: boolean
  onClick: () => void
  disabled?: boolean
  color?: 'primary' | 'success' | 'danger' | 'warning'
}) {
  const colorClasses = {
    primary: isActive ? 'bg-industrial-primary' : 'bg-industrial-surface',
    success: isActive ? 'bg-industrial-success' : 'bg-industrial-surface',
    danger: isActive ? 'bg-industrial-danger' : 'bg-industrial-surface',
    warning: isActive ? 'bg-industrial-warning' : 'bg-industrial-surface',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative px-6 py-4 rounded-lg font-medium transition-all
        ${colorClasses[color]}
        ${isActive ? 'text-white shadow-lg' : 'text-gray-400 hover:bg-industrial-border'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${isActive && !disabled ? `glow-${color}` : ''}
      `}
    >
      {label}
      {isActive && (
        <div className="absolute top-2 right-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        </div>
      )}
    </button>
  )
}

// 状态指示灯组件
function StatusIndicator({ 
  label, 
  status,
  value 
}: {
  label: string
  status: 'active' | 'inactive' | 'warning' | 'error'
  value?: string | number
}) {
  const statusColors = {
    active: 'bg-industrial-success',
    inactive: 'bg-gray-600',
    warning: 'bg-industrial-warning',
    error: 'bg-industrial-danger'
  }

  const glowColors = {
    active: 'shadow-industrial-success/50',
    inactive: '',
    warning: 'shadow-industrial-warning/50',
    error: 'shadow-industrial-danger/50'
  }

  return (
    <div className="flex items-center justify-between p-3 bg-industrial-surface rounded-lg">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${statusColors[status]} ${glowColors[status]} ${status !== 'inactive' ? 'shadow-lg animate-pulse' : ''}`} />
        <span className="text-sm text-gray-400">{label}</span>
      </div>
      {value !== undefined && (
        <span className="text-sm font-medium">{value}</span>
      )}
    </div>
  )
}

// 参数显示组件
function ParameterDisplay({ 
  label, 
  value, 
  unit,
  icon: Icon,
  trend 
}: {
  label: string
  value: number | string
  unit: string
  icon: any
  trend?: 'up' | 'down' | 'stable'
}) {
  const trendColors = {
    up: 'text-industrial-success',
    down: 'text-industrial-danger',
    stable: 'text-gray-400'
  }

  return (
    <div className="industrial-card">
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-5 h-5 text-industrial-primary" />
        {trend && (
          <TrendingUp className={`w-4 h-4 ${trendColors[trend]}`} />
        )}
      </div>
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-2xl font-bold mt-1">
        {value}
        <span className="text-lg text-gray-400 ml-1">{unit}</span>
      </p>
    </div>
  )
}

export default function ControlPage() {
  const [isSystemActive, setIsSystemActive] = useState(false)
  const [isEmergencyStop, setIsEmergencyStop] = useState(false)
  const [deviceStates, setDeviceStates] = useState({
    device1: false,
    device2: false,
    device3: false,
    device4: false,
  })
  const [controlMode, setControlMode] = useState<'manual' | 'auto'>('manual')
  const [sequenceRunning, setSequenceRunning] = useState(false)
  const [currentSequenceStep, setCurrentSequenceStep] = useState(0)
  
  // 实时参数
  const [parameters, setParameters] = useState({
    systemVoltage: 738,
    outputCurrent: 0,
    temperature: 25.6,
    pressure: 101.3,
    frequency: 50.0,
    efficiency: 0
  })

  // 测试序列
  const testSequence = [
    { id: 1, name: '系统初始化', duration: 2000, action: 'init' },
    { id: 2, name: '设备1开启', duration: 1000, action: 'device1_on' },
    { id: 3, name: '电压稳定测试', duration: 3000, action: 'voltage_test' },
    { id: 4, name: '设备2开启', duration: 1000, action: 'device2_on' },
    { id: 5, name: '负载测试', duration: 5000, action: 'load_test' },
    { id: 6, name: '系统关闭', duration: 2000, action: 'shutdown' }
  ]

  // 模拟参数更新
  useEffect(() => {
    const interval = setInterval(() => {
      if (isSystemActive && !isEmergencyStop) {
        setParameters(prev => ({
          systemVoltage: prev.systemVoltage + (Math.random() - 0.5) * 2,
          outputCurrent: Object.values(deviceStates).filter(Boolean).length * (15 + Math.random() * 5),
          temperature: prev.temperature + (Math.random() - 0.5) * 0.5,
          pressure: prev.pressure + (Math.random() - 0.5) * 0.2,
          frequency: 50 + (Math.random() - 0.5) * 0.1,
          efficiency: Object.values(deviceStates).filter(Boolean).length > 0 ? 85 + Math.random() * 10 : 0
        }))
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isSystemActive, isEmergencyStop, deviceStates])

  // 运行测试序列
  useEffect(() => {
    if (sequenceRunning && !isEmergencyStop) {
      if (currentSequenceStep < testSequence.length) {
        const step = testSequence[currentSequenceStep]
        const timer = setTimeout(() => {
          // 执行序列动作
          switch (step.action) {
            case 'init':
              setIsSystemActive(true)
              break
            case 'device1_on':
              setDeviceStates(prev => ({ ...prev, device1: true }))
              break
            case 'device2_on':
              setDeviceStates(prev => ({ ...prev, device2: true }))
              break
            case 'shutdown':
              setIsSystemActive(false)
              setDeviceStates({ device1: false, device2: false, device3: false, device4: false })
              break
          }
          setCurrentSequenceStep(prev => prev + 1)
        }, step.duration)

        return () => clearTimeout(timer)
      } else {
        setSequenceRunning(false)
        setCurrentSequenceStep(0)
      }
    }
  }, [sequenceRunning, currentSequenceStep, isEmergencyStop])

  const handleEmergencyStop = () => {
    setIsEmergencyStop(true)
    setIsSystemActive(false)
    setDeviceStates({ device1: false, device2: false, device3: false, device4: false })
    setSequenceRunning(false)
    setCurrentSequenceStep(0)
  }

  const handleReset = () => {
    setIsEmergencyStop(false)
    setIsSystemActive(false)
    setDeviceStates({ device1: false, device2: false, device3: false, device4: false })
    setSequenceRunning(false)
    setCurrentSequenceStep(0)
  }

  const handleStartSequence = () => {
    if (!isEmergencyStop && !sequenceRunning) {
      setSequenceRunning(true)
      setCurrentSequenceStep(0)
    }
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold">点动控制</h1>
        <p className="text-gray-400 mt-1">精确控制光伏关断器设备，支持手动和自动测试序列</p>
      </div>

      {/* 紧急停止和系统状态 */}
      <div className="flex items-center justify-between p-4 bg-industrial-surface rounded-lg border border-industrial-border">
        <div className="flex items-center gap-4">
          <div className={`px-4 py-2 rounded-lg font-medium ${isSystemActive ? 'bg-industrial-success text-white' : 'bg-gray-600 text-gray-300'}`}>
            系统状态: {isSystemActive ? '运行中' : '已停止'}
          </div>
          <div className={`px-4 py-2 rounded-lg font-medium ${controlMode === 'auto' ? 'bg-industrial-primary text-white' : 'bg-gray-600 text-gray-300'}`}>
            模式: {controlMode === 'auto' ? '自动' : '手动'}
          </div>
        </div>
        <button
          onClick={handleEmergencyStop}
          disabled={isEmergencyStop}
          className={`
            px-8 py-4 rounded-lg font-bold text-white transition-all
            ${isEmergencyStop ? 'bg-gray-600 cursor-not-allowed' : 'bg-industrial-danger hover:bg-industrial-danger/90 hover:scale-105 shadow-lg shadow-industrial-danger/25'}
          `}
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6" />
            紧急停止
          </div>
        </button>
      </div>

      {/* 主控制面板 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 设备控制 */}
        <div className="lg:col-span-2 space-y-4">
          {/* 系统控制 */}
          <div className="industrial-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Power className="w-5 h-5" />
              系统控制
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <ControlButton
                label="系统启动"
                isActive={isSystemActive && !isEmergencyStop}
                onClick={() => !isEmergencyStop && setIsSystemActive(true)}
                disabled={isEmergencyStop}
                color="success"
              />
              <ControlButton
                label="系统停止"
                isActive={!isSystemActive}
                onClick={() => setIsSystemActive(false)}
                disabled={isEmergencyStop}
                color="danger"
              />
              <ControlButton
                label="系统重置"
                isActive={false}
                onClick={handleReset}
                color="warning"
              />
            </div>
          </div>

          {/* 设备控制网格 */}
          <div className="industrial-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              设备控制阵列
            </h3>
            <div className="grid grid-cols-4 gap-4">
              {Object.entries(deviceStates).map(([device, state], index) => (
                <div key={device} className="text-center">
                  <button
                    onClick={() => {
                      if (!isEmergencyStop && isSystemActive) {
                        setDeviceStates(prev => ({ ...prev, [device]: !prev[device as keyof typeof prev] }))
                      }
                    }}
                    disabled={isEmergencyStop || !isSystemActive}
                    className={`
                      w-full aspect-square rounded-lg border-2 transition-all
                      ${state 
                        ? 'bg-industrial-success/20 border-industrial-success text-industrial-success shadow-lg shadow-industrial-success/25' 
                        : 'bg-industrial-surface border-industrial-border text-gray-500 hover:border-gray-400'
                      }
                      ${(isEmergencyStop || !isSystemActive) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                    `}
                  >
                    <div className="flex flex-col items-center justify-center h-full gap-2">
                      <Zap className={`w-8 h-8 ${state ? 'animate-pulse' : ''}`} />
                      <span className="text-sm font-medium">设备 {index + 1}</span>
                      <span className="text-xs">{state ? 'ON' : 'OFF'}</span>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 测试序列控制 */}
          <div className="industrial-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Timer className="w-5 h-5" />
              自动测试序列
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleStartSequence}
                  disabled={isEmergencyStop || sequenceRunning}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-industrial-primary text-white hover:bg-industrial-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sequenceRunning ? (
                    <>
                      <Pause className="w-4 h-4" />
                      运行中
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      开始序列
                    </>
                  )}
                </button>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setControlMode('manual')}
                    className={`px-4 py-2 rounded ${controlMode === 'manual' ? 'bg-industrial-primary text-white' : 'bg-industrial-surface text-gray-400'}`}
                  >
                    手动模式
                  </button>
                  <button
                    onClick={() => setControlMode('auto')}
                    className={`px-4 py-2 rounded ${controlMode === 'auto' ? 'bg-industrial-primary text-white' : 'bg-industrial-surface text-gray-400'}`}
                  >
                    自动模式
                  </button>
                </div>
              </div>
              
              {/* 序列步骤列表 */}
              <div className="space-y-2">
                {testSequence.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                      index === currentSequenceStep && sequenceRunning
                        ? 'bg-industrial-primary/20 border border-industrial-primary'
                        : index < currentSequenceStep
                        ? 'bg-industrial-success/10 border border-industrial-success/30'
                        : 'bg-industrial-surface'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        index < currentSequenceStep
                          ? 'bg-industrial-success text-white'
                          : index === currentSequenceStep && sequenceRunning
                          ? 'bg-industrial-primary text-white'
                          : 'bg-industrial-border text-gray-400'
                      }`}>
                        {index < currentSequenceStep ? <CheckCircle className="w-4 h-4" /> : index + 1}
                      </div>
                      <span className="font-medium">{step.name}</span>
                    </div>
                    <span className="text-sm text-gray-400">{step.duration / 1000}s</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 状态监控面板 */}
        <div className="space-y-4">
          {/* 实时参数 */}
          <div className="space-y-4">
            <ParameterDisplay
              label="系统电压"
              value={parameters.systemVoltage.toFixed(1)}
              unit="V"
              icon={Zap}
              trend="stable"
            />
            <ParameterDisplay
              label="输出电流"
              value={parameters.outputCurrent.toFixed(1)}
              unit="A"
              icon={Activity}
              trend={parameters.outputCurrent > 0 ? 'up' : 'stable'}
            />
            <ParameterDisplay
              label="系统效率"
              value={parameters.efficiency.toFixed(1)}
              unit="%"
              icon={Gauge}
              trend={parameters.efficiency > 90 ? 'up' : 'down'}
            />
          </div>

          {/* 系统状态指示 */}
          <div className="industrial-card">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              系统状态
            </h4>
            <div className="space-y-2">
              <StatusIndicator 
                label="主电源" 
                status={isSystemActive ? 'active' : 'inactive'} 
              />
              <StatusIndicator 
                label="安全联锁" 
                status={isEmergencyStop ? 'error' : 'active'} 
              />
              <StatusIndicator 
                label="通信状态" 
                status="active" 
              />
              <StatusIndicator 
                label="温度监控" 
                status={parameters.temperature > 30 ? 'warning' : 'active'}
                value={`${parameters.temperature.toFixed(1)}°C`}
              />
              <StatusIndicator 
                label="系统压力" 
                status="active"
                value={`${parameters.pressure.toFixed(1)} kPa`}
              />
            </div>
          </div>

          {/* 操作日志 */}
          <div className="industrial-card">
            <h4 className="font-semibold mb-3">最近操作</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between text-gray-400">
                <span>系统启动</span>
                <span>10:23:45</span>
              </div>
              <div className="flex items-center justify-between text-gray-400">
                <span>设备1开启</span>
                <span>10:24:12</span>
              </div>
              <div className="flex items-center justify-between text-gray-400">
                <span>参数调整</span>
                <span>10:25:08</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}