"use client"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { deleteSession } from "@/lib/storage"
import type { Session } from "@/lib/storage"
import { Trash2, Eye } from "lucide-react"
import { useState } from "react"

interface SessionsListProps {
  sessions: Session[]
}

export function SessionsList({ sessions }: SessionsListProps) {
  const [localSessions, setLocalSessions] = useState(sessions)

  const handleDelete = (id: string) => {
    deleteSession(id)
    setLocalSessions(localSessions.filter((s) => s.id !== id))
  }

  if (localSessions.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <p className="text-muted-foreground">No sessions found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {localSessions.map((session) => (
        <Card key={session.id} className="p-4 bg-card border border-border hover:border-accent/50 transition-colors">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={session.type === "communication" ? "secondary" : "outline"}>
                  {session.type === "communication" ? "💬 Communication" : "💻 Coding"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {new Date(session.date).toLocaleDateString()} at {new Date(session.date).toLocaleTimeString()}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Duration</span>
                  <p className="font-semibold">
                    {Math.floor(session.duration / 60)}:{(session.duration % 60).toString().padStart(2, "0")}
                  </p>
                </div>

                {session.type === "communication" && (
                  <>
                    <div>
                      <span className="text-muted-foreground">Questions</span>
                      <p className="font-semibold">
                        {"questionsAnswered" in session ? session.questionsAnswered : 0}/3
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Words Spoken</span>
                      <p className="font-semibold">
                        {"transcript" in session && session.transcript
                          ? session.transcript.split(/\s+/).filter((w) => w).length
                          : 0}
                      </p>
                    </div>
                  </>
                )}

                {session.type === "coding" && (
                  <>
                    <div>
                      <span className="text-muted-foreground">Solved</span>
                      <p className="font-semibold">
                        {"problemsSolved" in session ? session.problemsSolved : 0}/{" "}
                        {"totalProblems" in session ? session.totalProblems : 0}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Accuracy</span>
                      <p className="font-semibold">{"accuracy" in session ? session.accuracy : 0}%</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex gap-2 ml-4">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500/70 hover:text-red-500"
                onClick={() => handleDelete(session.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
