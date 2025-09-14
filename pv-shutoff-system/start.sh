#!/bin/bash

echo "🚀 光伏关断器实验数据管理系统"
echo "================================"
echo ""
echo "🔧 检查环境..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  警告: 未找到 .env.local 文件"
    echo "请确保已配置 Supabase 环境变量"
fi

echo ""
echo "✅ 启动开发服务器..."
echo "🌐 访问 http://localhost:3000"
echo ""

npm run dev