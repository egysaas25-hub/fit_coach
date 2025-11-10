"use client"

import type React from "react"

interface KPICardProps {
  title: string
  value: string | number
  subtext?: string
  icon?: React.ReactNode
  onClick?: () => void
  trend?: {
    value: number
    isPositive: boolean
  }
}

export default function KPICard({ title, value, subtext, icon, onClick, trend }: KPICardProps) {
  return (
    <div
      className="card p-6 cursor-pointer hover:border-primary/50 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-secondary text-sm font-medium mb-2">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold font-poppins text-foreground">{value}</p>
            {trend && (
              <span className={`text-sm font-semibold ${trend.isPositive ? "text-primary" : "text-destructive"}`}>
                {trend.isPositive ? "+" : ""}
                {trend.value}%
              </span>
            )}
          </div>
          {subtext && <p className="text-xs text-secondary mt-1">{subtext}</p>}
        </div>
        {icon && <div className="text-2xl text-primary">{icon}</div>}
      </div>
    </div>
  )
}
