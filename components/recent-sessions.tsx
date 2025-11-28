"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

interface RecentSessionsProps {
  sessions: any[]
}

export default function RecentSessions({ sessions }: RecentSessionsProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Sessions</CardTitle>
            <CardDescription>Your latest practice sessions</CardDescription>
          </div>
          <Link href="/progress">
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No sessions yet. Start your first practice session!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm text-foreground capitalize">{session.type} Practice</p>
                    <Badge variant="secondary" className="text-xs">
                      {session.score || 0}%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(session.date).toLocaleDateString()} at{" "}
                    {new Date(session.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
