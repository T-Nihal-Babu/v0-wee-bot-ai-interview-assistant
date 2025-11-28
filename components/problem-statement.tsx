"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ProblemStatementProps {
  title: string
  difficulty: string
  description: string
  examples: Array<{
    input: string
    output: string
    explanation?: string
  }>
}

export function ProblemStatement({ title, difficulty, description, examples }: ProblemStatementProps) {
  const difficultyColor = difficulty === "Easy" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"

  return (
    <Card className="p-6 bg-card border border-border space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-2xl font-bold">{title}</h2>
          <Badge className={difficultyColor}>{difficulty}</Badge>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Description</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>

        {examples.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">Examples</h3>
            <div className="space-y-3">
              {examples.map((example, i) => (
                <div key={i} className="bg-background/50 rounded-lg p-4 space-y-2 text-sm font-mono">
                  <div>
                    <span className="text-muted-foreground">Input: </span>
                    <span className="text-foreground">{example.input}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Output: </span>
                    <span className="text-accent">{example.output}</span>
                  </div>
                  {example.explanation && (
                    <div className="text-muted-foreground">
                      <span>Explanation: </span>
                      {example.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-sm">
          <p className="text-blue-400">
            💡 Tip: Write a solution that handles edge cases and is optimized for both time and space complexity.
          </p>
        </div>
      </div>
    </Card>
  )
}
