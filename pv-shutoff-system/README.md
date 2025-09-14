# 光伏关断器实验数据管理系统

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-14.0+-black?style=for-the-badge&logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Supabase-2.0+-green?style=for-the-badge&logo=supabase" alt="Supabase"/>
  <img src="https://img.shields.io/badge/Netlify-Deploy-00C7B7?style=for-the-badge&logo=netlify" alt="Netlify"/>
</div>

## 🚀 项目简介

光伏关断器实验数据管理系统是一个现代化、工业级的Web应用平台，专为光伏设备测试和数据管理而设计。系统采用最新的Web技术栈，提供实时数据监控、实验仿真、数据分析和报告生成等全方位功能。

### ✨ 核心特性

- 📊 **实时数据大屏** - 工业级数据可视化仪表板
- 🔬 **实验仿真** - 支持多种波形生成和实时显示
- 📁 **数据管理** - Excel导入/导出，批量数据处理
- 🎯 **点动控制** - 精确的设备控制界面
- 📈 **智能分析** - 自动报告生成和趋势分析
- 🔒 **企业级安全** - 基于Supabase的认证和授权
- 📱 **响应式设计** - 支持多种设备和屏幕尺寸

## 🛠️ 技术栈

### 前端技术
- **框架**: [Next.js 14+](https://nextjs.org/) (App Router)
- **语言**: [TypeScript 5+](https://www.typescriptlang.org/)
- **样式**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn/ui](https://ui.shadcn.com/)
- **图表**: [Recharts](https://recharts.org/) / [Apache ECharts](https://echarts.apache.org/)
- **状态管理**: [Zustand](https://zustand-demo.pmnd.rs/)
- **数据获取**: [TanStack Query](https://tanstack.com/query)
- **表格**: [TanStack Table](https://tanstack.com/table)
- **文件处理**: [SheetJS](https://sheetjs.com/)

### 后端服务 (Supabase)
- **数据库**: PostgreSQL
- **认证**: Supabase Auth
- **实时通信**: Supabase Realtime
- **文件存储**: Supabase Storage
- **API**: RESTful API + GraphQL

### 部署
- **托管**: [Netlify](https://www.netlify.com/)
- **CDN**: Netlify Edge
- **CI/CD**: GitHub Actions

## 📋 前置要求

- Node.js 18.0+
- npm 或 yarn 或 pnpm
- Git
- Supabase 账号
- Netlify 账号

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/your-username/pv-shutoff-test-system.git
cd pv-shutoff-test-system
```

### 2. 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 3. 环境配置

创建 `.env.local` 文件并添加以下环境变量：

```env
# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=https://zzyueuweeoakopuuwfau.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6eXVldXdlZW9ha29wdXV3ZmF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzODEzMDEsImV4cCI6MjA1OTk1NzMwMX0.y8V3EXK9QVd3txSWdE3gZrSs96Ao0nvpnd0ntZw_dQ4
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6eXVldXdlZW9ha29wdXV3ZmF1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDM4MTMwMSwiZXhwIjoyMDU5OTU3MzAxfQ.CTLF9Ahmxt7alyiv-sf_Gl3U6SNIWZ01PapTI92Hg0g

# 应用配置
NEXT_PUBLIC_APP_NAME="光伏关断器实验数据管理系统"
NEXT_PUBLIC_APP_VERSION="1.0.0"
```

### 4. 数据库初始化

运行数据库迁移脚本：

```bash
npm run db:migrate
```

### 5. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📁 项目结构

```
pv-shutoff-test-system/
├── app/                      # Next.js App Router
│   ├── (auth)/              # 认证相关页面
│   ├── (dashboard)/         # 仪表板页面
│   │   ├── dashboard/       # 数据大屏
│   │   ├── experiments/     # 实验管理
│   │   ├── simulation/      # 实验仿真
│   │   ├── control/         # 点动控制
│   │   └── files/           # 文件管理
│   ├── api/                 # API路由
│   ├── layout.tsx           # 根布局
│   └── page.tsx             # 首页
├── components/              # React组件
│   ├── ui/                  # UI基础组件
│   ├── charts/              # 图表组件
│   ├── dashboard/           # 仪表板组件
│   ├── simulation/          # 仿真组件
│   └── shared/              # 共享组件
├── lib/                     # 工具函数和配置
│   ├── supabase/           # Supabase客户端
│   ├── utils/              # 工具函数
│   └── constants/          # 常量定义
├── hooks/                   # 自定义React Hooks
├── services/               # API服务层
├── types/                  # TypeScript类型定义
├── styles/                 # 全局样式
├── public/                 # 静态资源
└── data/                   # 示例数据文件
```

## 🗃️ 数据库架构

### 主要数据表

- `devices` - 设备信息
- `experiments` - 实验记录
- `experiment_data` - 实验数据
- `simulation_configs` - 仿真配置
- `data_files` - 文件管理
- `users` - 用户信息
- `audit_logs` - 审计日志

详细的数据库架构请参考 [数据库文档](./docs/database.md)。

## 🔧 配置说明

### Supabase配置

1. 创建Supabase项目
2. 执行数据库迁移脚本
3. 配置Row Level Security (RLS)策略
4. 设置Storage buckets

### Netlify部署配置

1. 连接GitHub仓库
2. 配置环境变量
3. 设置构建命令：`npm run build`
4. 设置发布目录：`.next`

## 📝 开发指南

### 代码规范

- 使用ESLint和Prettier进行代码格式化
- 遵循TypeScript严格模式
- 组件使用函数式组件和Hooks
- 使用conventional commits规范

### 提交规范

```bash
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建过程或辅助工具的变动
```

### 测试

```bash
# 运行单元测试
npm run test

# 运行端到端测试
npm run test:e2e

# 运行测试覆盖率
npm run test:coverage
```

## 🚀 部署

### Netlify部署

1. Fork本项目到你的GitHub账号
2. 登录Netlify并导入项目
3. 配置环境变量
4. 点击部署

### 手动部署

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm run start
```

## 📊 性能优化

- 图片使用Next.js Image组件优化
- 实施代码分割和懒加载
- 使用React.memo和useMemo优化渲染
- 配置适当的缓存策略
- 使用Web Workers处理大量数据

## 🔒 安全措施

- 所有API请求使用HTTPS
- 实施CSRF保护
- XSS防护
- SQL注入防护（通过Supabase）
- 敏感数据加密存储

## 🤝 贡献指南

1. Fork项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交Pull Request

## 📄 许可证

本项目采用 MIT 许可证。查看 [LICENSE](LICENSE) 文件了解更多信息。

## 👥 团队

- 产品经理: PM Name
- 技术负责人: Tech Lead Name
- 前端开发: Frontend Dev Name
- UI/UX设计: Designer Name

## 📞 联系方式

- 项目邮箱: project@example.com
- 技术支持: support@example.com
- 官方网站: https://pv-shutoff-system.com

## 🙏 致谢

感谢所有为本项目做出贡献的开发者和用户。

---

<div align="center">
  Made with ❤️ by PV Shutoff Test System Team
</div>