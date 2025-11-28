"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Loader2 } from "lucide-react"

interface QuestionsPanelProps {
  currentQuestion: string
  questionNumber: number
  totalQuestions: number
  onSkip: () => void
  isLoading?: boolean
}

export function QuestionsPanel({
  currentQuestion,
  questionNumber,
  totalQuestions,
  onSkip,
  isLoading = false,
}: QuestionsPanelProps) {
  return (
    <Card className="p-6 bg-card border border-border">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Current Question</h3>
          <Badge variant="outline">
            {questionNumber} / {totalQuestions}
          </Badge>
        </div>
      </div>

      <div className="bg-background/50 rounded-lg p-6 mb-6 min-h-40 flex items-center justify-center">
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Generating next question...</span>
          </div>
        ) : (
          <p className="text-lg leading-relaxed text-foreground">{currentQuestion || "Loading question..."}</p>
        )}
      </div>

      <div className="space-y-2 text-sm text-muted-foreground mb-4">
        <p>💡 Tip: Take your time to formulate a thoughtful answer (2-3 minutes)</p>
        <p>✓ Speak clearly and naturally, as you would in a real interview</p>
      </div>

      <Button onClick={onSkip} variant="secondary" className="w-full" disabled={isLoading}>
        <ChevronRight className="w-4 h-4 mr-2" />
        Next Question
      </Button>
    </Card>
  )
}
