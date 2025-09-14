import Link from 'next/link'
import { 
  Activity, 
  BarChart3, 
  FileSpreadsheet, 
  Gauge, 
  Zap,
  ArrowRight,
  ChevronRight,
  Database,
  LineChart
} from 'lucide-react'

export default function HomePage() {
  const features = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "实时数据监控",
      description: "工业级数据可视化仪表板，实时监控设备状态和性能指标",
      href: "/dashboard",
      gradient: "gradient-primary",
      stats: "10,000+ 数据点/秒"
    },
    {
      icon: <LineChart className="w-8 h-8" />,
      title: "实验仿真",
      description: "支持多种波形生成，实时显示和参数调节",
      href: "/simulation",
      gradient: "gradient-success",
      stats: "4种波形类型"
    },
    {
      icon: <FileSpreadsheet className="w-8 h-8" />,
      title: "数据文件管理",
      description: "Excel导入导出，批量数据处理和版本管理",
      href: "/files",
      gradient: "gradient-warning",
      stats: "支持多种格式"
    },
    {
      icon: <Gauge className="w-8 h-8" />,
      title: "点动控制",
      description: "精确的设备控制界面，支持批量测试序列",
      href: "/control",
      gradient: "gradient-danger",
      stats: "毫秒级响应"
    }
  ]

  const stats = [
    { label: "活跃设备", value: "24", change: "+12%", positive: true },
    { label: "今日实验", value: "142", change: "+8%", positive: true },
    { label: "数据记录", value: "1.2M", change: "+23%", positive: true },
    { label: "系统运行时间", value: "99.9%", change: "0%", positive: true }
  ]

  return (
    <div className="min-h-screen bg-industrial-darker">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-industrial-primary/20 to-transparent" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-industrial-primary/20 border border-industrial-primary/30 text-industrial-primary">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">工业 4.0 数据管理平台</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">
              光伏关断器实验数据管理系统
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              专为光伏设备测试设计的现代化、工业级Web应用平台，提供实时监控、数据分析和智能报告生成
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-medium bg-industrial-primary text-white rounded-lg hover:bg-industrial-primary/90 transition-all hover:scale-105 shadow-lg shadow-industrial-primary/25"
              >
                进入控制台
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-medium bg-industrial-surface text-gray-300 rounded-lg hover:bg-industrial-border transition-all border border-industrial-border"
              >
                查看文档
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 -mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="industrial-card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="metric-label">{stat.label}</p>
                  <p className="metric-value">{stat.value}</p>
                </div>
                <div className={`metric-change ${stat.positive ? 'positive' : 'negative'}`}>
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">核心功能模块</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            集成了数据采集、实时监控、智能分析和报告生成等全方位功能
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Link
              key={index}
              href={feature.href}
              className="group industrial-card hover:border-industrial-primary/50 transition-all hover:shadow-2xl hover:shadow-industrial-primary/10"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${feature.gradient} text-white`}>
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-industrial-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 mb-3">{feature.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{feature.stats}</span>
                    <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-industrial-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="industrial-card bg-gradient-to-r from-industrial-surface to-industrial-dark p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">准备开始使用？</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            立即体验工业级的数据管理解决方案，提升您的实验效率
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 font-medium bg-industrial-primary text-white rounded-lg hover:bg-industrial-primary/90 transition-all"
            >
              <Activity className="w-5 h-5" />
              开始使用
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 font-medium bg-industrial-surface text-gray-300 rounded-lg hover:bg-industrial-border transition-all border border-industrial-border"
            >
              <Database className="w-5 h-5" />
              联系我们
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}