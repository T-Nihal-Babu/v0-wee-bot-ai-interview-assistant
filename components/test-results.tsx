"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle } from "lucide-react"

interface TestCase {
  id: string
  input: string
  expected: string
  passed?: boolean
  actual?: string
}

interface TestResultsProps {
  testCases: TestCase[]
}

export function TestResults({ testCases }: TestResultsProps) {
  const passedCount = testCases.filter((t) => t.passed).length

  return (
    <Card className="p-6 bg-card border border-border">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Test Results</h3>
          <Badge
            variant={passedCount === testCases.length ? "default" : "secondary"}
            className={passedCount === testCases.length ? "bg-green-500/20 text-green-400" : ""}
          >
            {passedCount}/{testCases.length} passed
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        {testCases.map((testCase) => (
          <div
            key={testCase.id}
            className={`p-3 rounded-lg border ${
              testCase.passed ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"
            }`}
          >
            <div className="flex items-start gap-2">
              {testCase.passed ? (
                <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1 text-sm min-w-0">
                <div className="font-mono text-muted-foreground">
                  <span className="text-foreground">Input:</span> {testCase.input}
                </div>
                <div className="font-mono text-muted-foreground">
                  <span className="text-foreground">Expected:</span> {testCase.expected}
                </div>
                {!testCase.passed && testCase.actual && (
                  <div className="font-mono text-red-400">
                    <span className="text-foreground">Got:</span> {testCase.actual}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
