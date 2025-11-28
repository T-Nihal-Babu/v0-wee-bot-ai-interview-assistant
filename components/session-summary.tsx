"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Home } from "lucide-react"
import { saveSession } from "@/lib/storage"
import { useEffect } from "react"

interface SessionSummaryProps {
  transcript: string
  duration: number
  questionsAnswered: number
  onReset: () => void
}

export function SessionSummary({ transcript, duration, questionsAnswered, onReset }: SessionSummaryProps) {
  const minutes = Math.floor(duration / 60)
  const seconds = duration % 60

  useEffect(() => {
    const session = {
      id: `comm_${Date.now()}`,
      type: "communication" as const,
      date: new Date().toISOString(),
      duration,
      transcript,
      questions: [],
      questionsAnswered,
      score: Math.round(Math.random() * 30 + 70), // Mock score
    }
    saveSession(session)
  }, [])

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card className="p-8 bg-card border border-border text-center">
        <div className="mb-6">
          <CheckCircle2 className="w-12 h-12 text-accent mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Session Complete!</h2>
          <p className="text-muted-foreground">Great job on completing your communication assessment.</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8 py-6 border-y border-border">
          <div>
            <Badge variant="outline" className="mb-2 block">
              Duration
            </Badge>
            <p className="text-2xl font-bold">
              {minutes}:{seconds.toString().padStart(2, "0")}
            </p>
          </div>
          <div>
            <Badge variant="outline" className="mb-2 block">
              Questions
            </Badge>
            <p className="text-2xl font-bold">{questionsAnswered}</p>
          </div>
          <div>
            <Badge variant="outline" className="mb-2 block">
              Words Spoken
            </Badge>
            <p className="text-2xl font-bold">{transcript.split(/\s+/).filter((w) => w).length}</p>
          </div>
        </div>

        <div className="space-y-2 mb-8 text-left">
          <h3 className="font-semibold mb-3">Your Transcript</h3>
          <div className="bg-background/50 rounded-lg p-4 max-h-48 overflow-y-auto text-sm text-muted-foreground">
            {transcript || "No transcript available"}
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={onReset} className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground">
            Practice Again
          </Button>
          <Link href="/progress" className="flex-1">
            <Button variant="secondary" className="w-full">
              View Progress
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button variant="secondary" className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
