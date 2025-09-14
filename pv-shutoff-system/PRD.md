# 产品需求文档 (PRD)
## 光伏关断器实验数据管理系统

### 1. 项目概述

#### 1.1 产品名称
光伏关断器实验数据管理系统 (Photovoltaic Shutoff Device Testing Data Management System)

#### 1.2 产品愿景
打造一个工业级、现代化、高端的实验数据管理平台，为光伏关断器的测试、分析和数据管理提供全方位的解决方案。系统将具备实时数据监控、历史数据分析、实验仿真和智能报告生成等功能。

#### 1.3 目标用户
- 光伏设备测试工程师
- 质量控制人员
- 研发工程师
- 实验室管理人员
- 数据分析师

### 2. 核心功能模块

#### 2.1 数据展示大屏 (Data Visualization Dashboard)
**功能描述：**
- 实时数据监控仪表板
- 多维度数据可视化（电流、电压、功率曲线）
- 设备状态实时监控
- 关键指标卡片展示
- 异常告警提示
- 数据趋势分析

**技术要求：**
- 响应式设计，支持大屏展示
- 实时数据更新（WebSocket）
- 高性能图表渲染
- 支持数据钻取和交互

#### 2.2 实验仿真页面 (Experiment Simulation)
**功能描述：**
- 波形发生器界面
- 实时波形显示（参考line.png）
- 参数调节控制面板
- 仿真结果实时展示
- 多通道同步显示
- 数据记录和回放

**子模块：**
1. **波形仿真模块**
   - PWM波形生成
   - 正弦波、方波、三角波模拟
   - 频率、幅值、相位调节
   - 触发模式设置

2. **数据采集模块**
   - 实时数据采集
   - 采样率配置
   - 数据缓存和存储
   - 触发条件设置

#### 2.3 数据文件管理 (Data File Management)
**功能描述：**
- Excel文件导入/导出
- 数据表格展示（参考lineandexcell.png）
- 文件版本管理
- 批量数据处理
- 数据格式转换
- 云端存储集成

**数据格式支持：**
- Excel (.xlsx, .xls)
- CSV
- JSON
- 自定义二进制格式

#### 2.4 点动实验控制 (Point Control Experiment)
**功能描述：**
- 精确点动控制界面（参考point.png）
- 开关状态指示
- 参数实时监控
- 操作日志记录
- 安全联锁功能
- 批量测试序列

**控制面板包含：**
- 设备选择器
- 参数设置区
- 状态指示灯阵列
- 紧急停止按钮
- 操作历史记录

#### 2.5 报告生成与分析 (Report Generation & Analysis)
**功能描述：**
- 自动报告生成
- 数据统计分析
- 趋势图表生成
- 异常数据标注
- PDF/Word导出
- 自定义报告模板

### 3. 数据模型设计

#### 3.1 核心数据结构
```sql
-- 设备信息表
devices {
  id: uuid
  device_address: integer
  device_type: string
  device_name: string
  status: enum('active', 'inactive', 'maintenance')
  created_at: timestamp
  updated_at: timestamp
}

-- 实验数据表
experiment_data {
  id: uuid
  device_id: uuid (FK)
  sequence_number: integer
  current: decimal
  voltage: decimal
  power: decimal
  timestamp: timestamp
  experiment_id: uuid (FK)
  created_at: timestamp
}

-- 实验信息表
experiments {
  id: uuid
  name: string
  description: text
  start_time: timestamp
  end_time: timestamp
  operator: string
  status: enum('running', 'completed', 'failed')
  parameters: jsonb
  created_at: timestamp
}

-- 文件管理表
data_files {
  id: uuid
  filename: string
  file_type: string
  file_size: integer
  storage_url: string
  experiment_id: uuid (FK)
  uploaded_by: string
  created_at: timestamp
}

-- 仿真配置表
simulation_configs {
  id: uuid
  name: string
  waveform_type: enum('sine', 'square', 'triangle', 'pwm')
  frequency: decimal
  amplitude: decimal
  phase: decimal
  duty_cycle: decimal
  parameters: jsonb
  created_at: timestamp
}
```

### 4. 技术架构

#### 4.1 前端技术栈
- **框架**: Next.js 14+ (App Router)
- **语言**: TypeScript
- **UI库**: Shadcn/ui + Tailwind CSS
- **图表**: Recharts / Apache ECharts
- **状态管理**: Zustand
- **数据获取**: TanStack Query
- **实时通信**: Supabase Realtime
- **表格**: TanStack Table
- **文件处理**: SheetJS (Excel处理)

#### 4.2 后端服务 (Supabase)
- **数据库**: PostgreSQL
- **认证**: Supabase Auth
- **实时订阅**: Supabase Realtime
- **文件存储**: Supabase Storage
- **边缘函数**: Supabase Edge Functions
- **RLS策略**: Row Level Security

#### 4.3 部署架构
- **托管平台**: Netlify
- **CDN**: Netlify Edge
- **环境变量管理**: Netlify Environment Variables
- **CI/CD**: GitHub Actions + Netlify

### 5. 用户界面设计规范

#### 5.1 设计原则
- **工业美学**: 深色主题，高对比度
- **数据优先**: 清晰的数据层次结构
- **响应式**: 支持多种屏幕尺寸
- **可访问性**: WCAG 2.1 AA标准

#### 5.2 配色方案
```css
primary: #0EA5E9 (蓝色 - 主要操作)
success: #22C55E (绿色 - 正常状态)
warning: #F59E0B (橙色 - 警告)
danger: #EF4444 (红色 - 错误/紧急)
background: #0F172A (深色背景)
surface: #1E293B (卡片背景)
text-primary: #F8FAFC
text-secondary: #94A3B8
```

#### 5.3 组件规范
- **数据卡片**: 圆角设计，微妙阴影
- **图表**: 支持暗色主题，网格线清晰
- **按钮**: 三种尺寸（大、中、小）
- **表格**: 斑马纹，固定表头
- **模态框**: 居中显示，背景模糊

### 6. 性能要求

#### 6.1 响应时间
- 页面加载: < 2秒
- 数据查询: < 500ms
- 实时更新延迟: < 100ms
- 文件上传: 支持大文件分片上传

#### 6.2 并发处理
- 支持100+并发用户
- 实时数据推送1000+数据点/秒
- 批量数据处理10万+记录

### 7. 安全要求

#### 7.1 认证授权
- 多因素认证
- 基于角色的访问控制
- API密钥管理
- 会话超时控制

#### 7.2 数据安全
- 传输加密 (HTTPS)
- 存储加密
- 敏感数据脱敏
- 操作审计日志

### 8. 功能优先级

#### P0 (核心功能)
1. 数据展示大屏
2. Excel数据导入/导出
3. 基础实验数据管理
4. 实时数据监控

#### P1 (重要功能)
1. 实验仿真界面
2. 点动控制功能
3. 报告生成
4. 用户权限管理

#### P2 (增强功能)
1. 高级数据分析
2. 机器学习预测
3. 移动端支持
4. 第三方系统集成

### 9. 开发计划

#### 第一阶段 (2周)
- 项目初始化和基础架构搭建
- Supabase数据库设计和配置
- 基础UI组件库建立
- 数据展示大屏MVP

#### 第二阶段 (3周)
- 数据文件管理功能
- Excel导入/导出
- 实验数据CRUD操作
- 基础图表展示

#### 第三阶段 (3周)
- 实验仿真页面
- 点动控制界面
- 实时数据推送
- 高级图表功能

#### 第四阶段 (2周)
- 报告生成功能
- 性能优化
- 安全加固
- 部署和测试

### 10. 成功指标

#### 10.1 技术指标
- 系统可用性 > 99.9%
- 数据准确性 100%
- 响应时间达标率 > 95%

#### 10.2 业务指标
- 数据处理效率提升 50%
- 报告生成时间减少 70%
- 用户满意度 > 90%

### 11. 风险评估

#### 11.1 技术风险
- **风险**: Supabase实时性能瓶颈
- **缓解**: 实施数据分片和缓存策略

#### 11.2 业务风险
- **风险**: 数据格式不兼容
- **缓解**: 建立完善的数据转换器

### 12. 维护和支持

#### 12.1 监控告警
- 应用性能监控 (APM)
- 错误追踪
- 用户行为分析
- 系统健康检查

#### 12.2 更新策略
- 月度安全更新
- 季度功能迭代
- 年度大版本升级
- 热修复机制

---

文档版本: 1.0.0
创建日期: 2025-01-14
最后更新: 2025-01-14