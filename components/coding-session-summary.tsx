"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Home } from "lucide-react"
import { saveSession } from "@/lib/storage"
import { useEffect } from "react"

interface CodingSessionSummaryProps {
  totalProblems: number
  completedProblems: number
  duration: number
  onReset: () => void
}

export function CodingSessionSummary({
  totalProblems,
  completedProblems,
  duration,
  onReset,
}: CodingSessionSummaryProps) {
  const minutes = Math.floor(duration / 60)
  const seconds = duration % 60
  const accuracy = totalProblems > 0 ? Math.round((completedProblems / totalProblems) * 100) : 0

  useEffect(() => {
    const session = {
      id: `coding_${Date.now()}`,
      type: "coding" as const,
      date: new Date().toISOString(),
      duration,
      problemsSolved: completedProblems,
      totalProblems,
      accuracy,
      score: Math.round((accuracy / 100) * 100),
    }
    saveSession(session)
  }, [])

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card className="p-8 bg-card border border-border text-center">
        <div className="mb-6">
          <CheckCircle2 className="w-12 h-12 text-accent mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Coding Challenge Complete!</h2>
          <p className="text-muted-foreground">You've successfully completed the coding assessment.</p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8 py-6 border-y border-border">
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
              Solved
            </Badge>
            <p className="text-2xl font-bold">
              {completedProblems}/{totalProblems}
            </p>
          </div>
          <div>
            <Badge variant="outline" className="mb-2 block">
              Success Rate
            </Badge>
            <p className="text-2xl font-bold">{accuracy}%</p>
          </div>
          <div>
            <Badge variant="outline" className="mb-2 block">
              Performance
            </Badge>
            <p className="text-2xl font-bold">
              {accuracy >= 80 ? "Excellent" : accuracy >= 60 ? "Good" : "Keep Trying"}
            </p>
          </div>
        </div>

        <div className="bg-background/50 rounded-lg p-4 mb-8 text-left space-y-2">
          <h3 className="font-semibold">Performance Summary</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>✓ Total Problems Attempted: {totalProblems}</li>
            <li>✓ Successfully Completed: {completedProblems}</li>
            <li>✓ Completion Rate: {accuracy}%</li>
            <li>
              ✓ Time Spent: {minutes} minutes {seconds} seconds
            </li>
          </ul>
        </div>

        <div className="flex gap-3">
          <Button onClick={onReset} className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground">
            Try Again
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
