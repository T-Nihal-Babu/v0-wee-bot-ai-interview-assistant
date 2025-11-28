"use client"

import { useMemo } from "react"
import { getSessions } from "@/lib/storage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp } from "lucide-react"

interface ProgressOverviewProps {
  user: any
}

export default function ProgressOverview({ user }: ProgressOverviewProps) {
  const stats = useMemo(() => {
    const sessions = getSessions()

    const totalSessions = sessions.length
    const totalMinutes = sessions.reduce((acc, s) => acc + (s.duration || 0), 0)
    const avgScore =
      sessions.length > 0 ? Math.round(sessions.reduce((acc, s) => acc + (s.score || 0), 0) / sessions.length) : 0

    const communicationSessions = sessions.filter((s) => s.type === "communication").length
    const codingSessions = sessions.filter((s) => s.type === "coding").length

    return {
      totalSessions,
      totalMinutes,
      avgScore,
      communicationSessions,
      codingSessions,
    }
  }, [])

  const metrics = [
    {
      title: "Total Sessions",
      value: stats.totalSessions,
      icon: BarChart3,
      color: "text-accent",
    },
    {
      title: "Communication",
      value: stats.communicationSessions,
      icon: () => <span className="text-lg">💬</span>,
      color: "text-blue-500",
    },
    {
      title: "Coding",
      value: stats.codingSessions,
      icon: () => <span className="text-lg">💻</span>,
      color: "text-green-500",
    },
    {
      title: "Average Score",
      value: `${stats.avgScore}%`,
      icon: TrendingUp,
      color: "text-purple-500",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map((metric, idx) => {
        const Icon = metric.icon
        return (
          <Card key={idx} className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div className="text-3xl font-bold text-foreground">{metric.value}</div>
                <div className={`${metric.color} opacity-50`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
