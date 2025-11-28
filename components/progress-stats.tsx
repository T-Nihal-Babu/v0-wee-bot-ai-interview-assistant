"use client"

import { Card } from "@/components/ui/card"
import { Clock, TrendingUp, CheckCircle2 } from "lucide-react"

interface ProgressStatsProps {
  title: string
  stats: {
    totalSessions: number
    totalDuration: number
    averageScore: number
  }
}

export function ProgressStats({ title, stats }: ProgressStatsProps) {
  const hours = Math.floor(stats.totalDuration / 3600)
  const minutes = Math.floor((stats.totalDuration % 3600) / 60)

  return (
    <Card className="p-6 bg-card border border-border">
      <h3 className="text-lg font-semibold mb-6">{title}</h3>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm">Sessions</span>
          </div>
          <p className="text-3xl font-bold">{stats.totalSessions}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Time Spent</span>
          </div>
          <p className="text-3xl font-bold">{hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Avg Score</span>
          </div>
          <div className="flex items-baseline gap-1">
            <p className="text-3xl font-bold">{stats.averageScore}</p>
            <span className="text-muted-foreground">/100</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
