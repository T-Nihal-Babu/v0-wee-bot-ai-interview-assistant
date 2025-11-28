"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CommunicationImprovements } from "@/components/communication-improvements"
import { CodingImprovements } from "@/components/coding-improvements"
import type { CommunicationSession, CodingSession } from "@/lib/storage"

interface ImprovementsSectionProps {
  communicationSessions: CommunicationSession[]
  codingSessions: CodingSession[]
}

export function ImprovementsSection({ communicationSessions, codingSessions }: ImprovementsSectionProps) {
  const [selectedCommSession, setSelectedCommSession] = useState<CommunicationSession | null>(
    communicationSessions[0] || null,
  )
  const [selectedCodeSession, setSelectedCodeSession] = useState<CodingSession | null>(codingSessions[0] || null)

  if (communicationSessions.length === 0 && codingSessions.length === 0) {
    return (
      <Card className="p-8 bg-card border border-border text-center">
        <p className="text-muted-foreground mb-4">No sessions available for analysis yet.</p>
        <p className="text-sm text-muted-foreground">Complete a session to get personalized improvement suggestions.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Improvisations</h2>
        <p className="text-muted-foreground mb-6">
          Get detailed analysis and personalized recommendations to improve your skills.
        </p>
      </div>

      <Tabs defaultValue="communication" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="communication" disabled={communicationSessions.length === 0}>
            Communication ({communicationSessions.length})
          </TabsTrigger>
          <TabsTrigger value="coding" disabled={codingSessions.length === 0}>
            Coding ({codingSessions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="communication" className="mt-6 space-y-6">
          {communicationSessions.length > 0 ? (
            <>
              <Card className="p-4 bg-card border border-border">
                <label className="text-sm font-medium mb-3 block">Select Session to Analyze</label>
                <select
                  value={selectedCommSession?.id || ""}
                  onChange={(e) => {
                    const session = communicationSessions.find((s) => s.id === e.target.value)
                    setSelectedCommSession(session || null)
                  }}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                >
                  {communicationSessions.map((session) => (
                    <option key={session.id} value={session.id}>
                      {new Date(session.date).toLocaleDateString()} - {Math.floor(session.duration / 60)}m{" "}
                      {session.duration % 60}s
                    </option>
                  ))}
                </select>
              </Card>
              {selectedCommSession && <CommunicationImprovements session={selectedCommSession} />}
            </>
          ) : (
            <Card className="p-8 bg-card border border-border text-center">
              <p className="text-muted-foreground">No communication sessions yet.</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="coding" className="mt-6 space-y-6">
          {codingSessions.length > 0 ? (
            <>
              <Card className="p-4 bg-card border border-border">
                <label className="text-sm font-medium mb-3 block">Select Session to Analyze</label>
                <select
                  value={selectedCodeSession?.id || ""}
                  onChange={(e) => {
                    const session = codingSessions.find((s) => s.id === e.target.value)
                    setSelectedCodeSession(session || null)
                  }}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                >
                  {codingSessions.map((session) => (
                    <option key={session.id} value={session.id}>
                      {new Date(session.date).toLocaleDateString()} - {session.problemsSolved}/{session.totalProblems}{" "}
                      solved
                    </option>
                  ))}
                </select>
              </Card>
              {selectedCodeSession && <CodingImprovements session={selectedCodeSession} />}
            </>
          ) : (
            <Card className="p-8 bg-card border border-border text-center">
              <p className="text-muted-foreground">No coding sessions yet.</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
