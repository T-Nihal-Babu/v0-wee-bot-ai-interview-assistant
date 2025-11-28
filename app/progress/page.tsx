"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { SessionsList } from "@/components/sessions-list"
import { ProgressStats } from "@/components/progress-stats"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getSessions, getStats } from "@/lib/storage"
import type { Session } from "@/lib/storage"

export default function ProgressPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    // Reload sessions when tab changes or component mounts
    const allSessions = getSessions()
    setSessions(allSessions)
  }, [])

  const communicationSessions = sessions.filter((s) => s.type === "communication")
  const codingSessions = sessions.filter((s) => s.type === "coding")

  const communicationStats = getStats("communication")
  const codingStats = getStats("coding")
  const overallStats = getStats()

  const displayedSessions =
    activeTab === "communication" ? communicationSessions : activeTab === "coding" ? codingSessions : sessions

  return (
    <>
      <Header title="Progress Tracking" description="View all your assessment sessions and performance metrics" />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Overall Stats */}
          <ProgressStats
            title="Overall Performance"
            stats={{
              totalSessions: overallStats.totalSessions,
              totalDuration: overallStats.totalDuration,
              averageScore: overallStats.averageScore,
            }}
          />

          {/* Sessions by Type */}
          <div className="grid md:grid-cols-2 gap-6">
            {communicationStats.totalSessions > 0 && (
              <ProgressStats
                title="Communication Skills"
                stats={{
                  totalSessions: communicationStats.totalSessions,
                  totalDuration: communicationStats.totalDuration,
                  averageScore: communicationStats.averageScore,
                }}
              />
            )}

            {codingStats.totalSessions > 0 && (
              <ProgressStats
                title="Coding Skills"
                stats={{
                  totalSessions: codingStats.totalSessions,
                  totalDuration: codingStats.totalDuration,
                  averageScore: codingStats.averageScore,
                }}
              />
            )}
          </div>

          {/* Sessions List */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Your Sessions</h2>

            {sessions.length === 0 ? (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <p className="text-muted-foreground mb-4">No sessions yet. Start practicing to see your progress!</p>
              </div>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full max-w-md grid-cols-3">
                  <TabsTrigger value="all">All ({sessions.length})</TabsTrigger>
                  <TabsTrigger value="communication">Communication ({communicationSessions.length})</TabsTrigger>
                  <TabsTrigger value="coding">Coding ({codingSessions.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-6">
                  <SessionsList sessions={displayedSessions} />
                </TabsContent>

                <TabsContent value="communication" className="mt-6">
                  <SessionsList sessions={displayedSessions} />
                </TabsContent>

                <TabsContent value="coding" className="mt-6">
                  <SessionsList sessions={displayedSessions} />
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
