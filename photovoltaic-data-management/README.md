# 光伏关断器数据管理系统

一个专业的光伏关断器测试数据管理与分析平台，采用现代化工业设计风格，提供数据导入、管理、可视化和分析功能。

## 功能特性

- 📊 **数据管理** - 完整的CRUD操作，支持批量导入Excel数据
- 📈 **数据大屏** - 实时数据可视化展示，工业风格设计
- 🔍 **实时监控** - 设备状态实时监控，异常告警
- 📑 **报表分析** - 自动生成日报、周报、月报
- 🔐 **安全可靠** - 基于Supabase的安全数据存储
- 🎨 **工业美学** - 深色主题，霓虹效果，专业视觉体验

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **UI组件**: Tailwind CSS + 自定义组件库
- **数据库**: Supabase (PostgreSQL)
- **部署**: Netlify
- **其他**: TypeScript, xlsx.js, date-fns

## 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装步骤

1. 克隆项目
```bash
git clone <repository-url>
cd photovoltaic-data-management
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
创建 `.env.local` 文件并添加以下内容：
```env
NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase匿名密钥
SUPABASE_SERVICE_ROLE_KEY=你的Supabase服务密钥
```

4. 运行开发服务器
```bash
npm run dev
```

5. 打开浏览器访问 `http://localhost:3000`

## 部署到Netlify

1. 将项目推送到GitHub
2. 在Netlify中导入项目
3. 配置环境变量
4. 部署

## 项目结构

```
photovoltaic-data-management/
├── src/
│   ├── app/              # Next.js应用路由
│   ├── components/       # React组件
│   │   ├── ui/          # UI基础组件
│   │   └── layout/      # 布局组件
│   ├── lib/             # 工具函数和配置
│   ├── types/           # TypeScript类型定义
│   └── hooks/           # React Hooks
├── public/              # 静态资源
├── supabase/            # 数据库结构
└── netlify.toml         # Netlify配置
```

## 数据库结构

系统使用以下主要数据表：

- `test_records` - 测试记录数据
- `import_batches` - 导入批次记录
- `devices` - 设备信息
- `analysis_results` - 分析结果
- `alerts` - 告警记录

详细结构请参考 `supabase/schema.sql`

## 开发指南

### 添加新页面

1. 在 `src/app/` 下创建新文件夹
2. 创建 `page.tsx` 文件
3. 使用 `DashboardLayout` 组件包裹页面内容

### 添加新组件

1. 在 `src/components/` 下创建组件文件
2. 遵循工业设计风格指南
3. 使用 Tailwind CSS 类名

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License