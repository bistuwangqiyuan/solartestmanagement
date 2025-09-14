'use client'

import { useState, useEffect, useRef } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Download,
  Settings,
  Waves,
  Square,
  Triangle,
  Activity,
  Sliders,
  Save,
  Upload
} from 'lucide-react'

// 波形生成函数
const generateWaveform = (
  type: 'sine' | 'square' | 'triangle' | 'pwm',
  frequency: number,
  amplitude: number,
  phase: number,
  dutyCycle: number = 50,
  points: number = 200
) => {
  const data = []
  for (let i = 0; i < points; i++) {
    const t = (i / points) * 4 * Math.PI // 显示2个周期
    let value = 0
    
    switch (type) {
      case 'sine':
        value = amplitude * Math.sin(frequency * t + phase)
        break
      case 'square':
        value = amplitude * (Math.sin(frequency * t + phase) >= 0 ? 1 : -1)
        break
      case 'triangle':
        const period = (2 * Math.PI) / frequency
        const localT = ((t + phase) % period) / period
        value = amplitude * (localT < 0.5 ? 4 * localT - 1 : 3 - 4 * localT)
        break
      case 'pwm':
        const pwmPeriod = (2 * Math.PI) / frequency
        const pwmLocalT = ((t + phase) % pwmPeriod) / pwmPeriod
        value = amplitude * (pwmLocalT < dutyCycle / 100 ? 1 : 0)
        break
    }
    
    data.push({
      time: i,
      value: parseFloat(value.toFixed(3)),
      voltage: parseFloat((20 + value * 0.5).toFixed(3)),
      current: parseFloat((Math.abs(value) * 0.8).toFixed(3))
    })
  }
  return data
}

// 参数控制组件
function ParameterControl({ 
  label, 
  value, 
  onChange, 
  min, 
  max, 
  step = 1,
  unit = '' 
}: {
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step?: number
  unit?: string
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm text-gray-400">{label}</label>
        <span className="text-sm font-medium">
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-industrial-surface rounded-lg appearance-none cursor-pointer slider"
      />
    </div>
  )
}

export default function SimulationPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [waveformType, setWaveformType] = useState<'sine' | 'square' | 'triangle' | 'pwm'>('sine')
  const [frequency, setFrequency] = useState(1)
  const [amplitude, setAmplitude] = useState(5)
  const [phase, setPhase] = useState(0)
  const [dutyCycle, setDutyCycle] = useState(50)
  const [waveformData, setWaveformData] = useState<any[]>([])
  const [currentTime, setCurrentTime] = useState(0)
  const animationRef = useRef<number | undefined>(undefined)

  // 生成波形数据
  useEffect(() => {
    const data = generateWaveform(waveformType, frequency, amplitude, phase, dutyCycle)
    setWaveformData(data)
  }, [waveformType, frequency, amplitude, phase, dutyCycle])

  // 动画循环
  useEffect(() => {
    if (isRunning) {
      const animate = () => {
        setCurrentTime(prev => (prev + 1) % 200)
        animationRef.current = requestAnimationFrame(animate)
      }
      animationRef.current = requestAnimationFrame(animate)
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isRunning])

  const waveformButtons = [
    { type: 'sine' as const, icon: Waves, label: '正弦波' },
    { type: 'square' as const, icon: Square, label: '方波' },
    { type: 'triangle' as const, icon: Triangle, label: '三角波' },
    { type: 'pwm' as const, icon: Activity, label: 'PWM' },
  ]

  const handleReset = () => {
    setIsRunning(false)
    setCurrentTime(0)
    setFrequency(1)
    setAmplitude(5)
    setPhase(0)
    setDutyCycle(50)
  }

  const handleSaveConfig = () => {
    const config = {
      waveformType,
      frequency,
      amplitude,
      phase,
      dutyCycle,
      timestamp: new Date().toISOString()
    }
    console.log('Saving configuration:', config)
    // 这里可以调用API保存到数据库
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold">实验仿真</h1>
        <p className="text-gray-400 mt-1">波形生成器和实时信号仿真</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 控制面板 */}
        <div className="lg:col-span-1 space-y-4">
          {/* 波形类型选择 */}
          <div className="industrial-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              波形类型
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {waveformButtons.map(({ type, icon: Icon, label }) => (
                <button
                  key={type}
                  onClick={() => setWaveformType(type)}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                    waveformType === type
                      ? 'bg-industrial-primary text-white'
                      : 'bg-industrial-surface text-gray-400 hover:bg-industrial-border'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 参数控制 */}
          <div className="industrial-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Sliders className="w-5 h-5" />
              参数调节
            </h3>
            <div className="space-y-4">
              <ParameterControl
                label="频率"
                value={frequency}
                onChange={setFrequency}
                min={0.1}
                max={10}
                step={0.1}
                unit="Hz"
              />
              <ParameterControl
                label="幅值"
                value={amplitude}
                onChange={setAmplitude}
                min={0}
                max={10}
                step={0.1}
                unit="V"
              />
              <ParameterControl
                label="相位"
                value={phase}
                onChange={setPhase}
                min={0}
                max={360}
                step={1}
                unit="°"
              />
              {waveformType === 'pwm' && (
                <ParameterControl
                  label="占空比"
                  value={dutyCycle}
                  onChange={setDutyCycle}
                  min={0}
                  max={100}
                  step={1}
                  unit="%"
                />
              )}
            </div>
          </div>

          {/* 控制按钮 */}
          <div className="industrial-card">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                  isRunning 
                    ? 'bg-industrial-danger text-white hover:bg-industrial-danger/90' 
                    : 'bg-industrial-success text-white hover:bg-industrial-success/90'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4" />
                    暂停
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    运行
                  </>
                )}
              </button>
              <button
                onClick={handleReset}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium bg-industrial-surface text-gray-300 hover:bg-industrial-border transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                重置
              </button>
              <button
                onClick={handleSaveConfig}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium bg-industrial-primary text-white hover:bg-industrial-primary/90 transition-all"
              >
                <Save className="w-4 h-4" />
                保存配置
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium bg-industrial-surface text-gray-300 hover:bg-industrial-border transition-all">
                <Upload className="w-4 h-4" />
                加载配置
              </button>
            </div>
          </div>

          {/* 实时数据 */}
          <div className="industrial-card">
            <h3 className="text-lg font-semibold mb-4">实时测量值</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">当前值</span>
                <span className="font-mono font-medium">
                  {waveformData[currentTime]?.value.toFixed(3) || '0.000'} V
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">电压</span>
                <span className="font-mono font-medium">
                  {waveformData[currentTime]?.voltage.toFixed(3) || '0.000'} V
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">电流</span>
                <span className="font-mono font-medium">
                  {waveformData[currentTime]?.current.toFixed(3) || '0.000'} A
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">功率</span>
                <span className="font-mono font-medium">
                  {((waveformData[currentTime]?.voltage || 0) * (waveformData[currentTime]?.current || 0)).toFixed(3)} W
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 波形显示 */}
        <div className="lg:col-span-2 space-y-4">
          {/* 主波形 */}
          <div className="industrial-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">波形显示</h3>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-industrial-surface text-gray-300 hover:bg-industrial-border transition-all text-sm">
                <Download className="w-4 h-4" />
                导出数据
              </button>
            </div>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={waveformData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#94A3B8"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#94A3B8"
                    tick={{ fontSize: 12 }}
                    domain={[-amplitude - 1, amplitude + 1]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#0EA5E9" 
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                  {/* 当前位置指示线 */}
                  {isRunning && (
                    <Line
                      data={[
                        { time: currentTime, value: -amplitude - 1 },
                        { time: currentTime, value: amplitude + 1 }
                      ]}
                      stroke="#EF4444"
                      strokeWidth={1}
                      dot={false}
                      isAnimationActive={false}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 电压电流曲线 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="industrial-card">
              <h4 className="font-semibold mb-3">电压曲线</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={waveformData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="time" stroke="#94A3B8" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#94A3B8" tick={{ fontSize: 10 }} />
                    <Line 
                      type="monotone" 
                      dataKey="voltage" 
                      stroke="#22C55E" 
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="industrial-card">
              <h4 className="font-semibold mb-3">电流曲线</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={waveformData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="time" stroke="#94A3B8" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#94A3B8" tick={{ fontSize: 10 }} />
                    <Line 
                      type="monotone" 
                      dataKey="current" 
                      stroke="#F59E0B" 
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}