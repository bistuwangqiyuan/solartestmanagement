import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "光伏关断器实验数据管理系统",
  description: "工业级光伏设备测试和数据管理平台",
  keywords: ["光伏", "关断器", "实验数据", "工业控制", "数据管理"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" className="dark">
      <body className={`${inter.className} bg-industrial-darker text-gray-100 antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}