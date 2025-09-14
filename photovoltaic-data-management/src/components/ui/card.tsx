import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border border-border bg-card text-card-foreground shadow-lg transition-all duration-200 hover:shadow-xl hover:border-primary/20",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 border-b border-border", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// 特殊的数据卡片组件
const DataCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title: string
    value: string | number
    unit?: string
    trend?: "up" | "down" | "neutral"
    trendValue?: string
  }
>(({ className, title, value, unit, trend, trendValue, ...props }, ref) => (
  <Card ref={ref} className={cn("relative overflow-hidden", className)} {...props}>
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
    <CardContent className="relative p-6">
      <p className="text-sm text-muted-foreground mb-2">{title}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold font-mono">{value}</span>
        {unit && <span className="text-lg text-muted-foreground">{unit}</span>}
      </div>
      {trend && trendValue && (
        <div className={cn(
          "flex items-center gap-1 mt-2 text-sm",
          trend === "up" && "text-success",
          trend === "down" && "text-error",
          trend === "neutral" && "text-muted-foreground"
        )}>
          {trend === "up" && "↑"}
          {trend === "down" && "↓"}
          {trend === "neutral" && "→"}
          <span>{trendValue}</span>
        </div>
      )}
    </CardContent>
  </Card>
))
DataCard.displayName = "DataCard"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, DataCard }