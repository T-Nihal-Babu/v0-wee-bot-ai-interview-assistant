"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Check, TrendingUp } from "lucide-react"

interface RealtimeFeedbackProps {
  transcript: string
  questionNumber: number
  confidenceLevel: number
}

export default function RealtimeFeedback({ transcript, questionNumber, confidenceLevel }: RealtimeFeedbackProps) {
  const analyzeAnswer = () => {
    if (!transcript) {
      return {
        hasStarted: false,
        wordCount: 0,
        duration: 0,
        quality: "not-started",
      }
    }

    const words = transcript.trim().split(/\s+/).length
    const hasFiller = /\b(um|uh|like|you know|I think|basically)\b/gi.test(transcript)
    const hasDetailedAnswer = words > 50
    const hasSpecificExamples = /\b(example|specific|case|project|time)\b/gi.test(transcript)

    let quality = "poor"
    if (hasDetailedAnswer && hasSpecificExamples && !hasFiller) quality = "excellent"
    else if (hasDetailedAnswer && hasSpecificExamples) quality = "good"
    else if (hasDetailedAnswer) quality = "fair"

    return {
      hasStarted: true,
      wordCount: words,
      quality,
      hasDetailedAnswer,
      hasSpecificExamples,
      hasFiller,
    }
  }

  const analysis = analyzeAnswer()

  const getQualityColor = (quality: string) => {
    if (quality === "excellent") return "text-green-500"
    if (quality === "good") return "text-blue-500"
    if (quality === "fair") return "text-yellow-500"
    return "text-muted-foreground"
  }

  const getQualityBg = (quality: string) => {
    if (quality === "excellent") return "bg-green-500/10"
    if (quality === "good") return "bg-blue-500/10"
    if (quality === "fair") return "bg-yellow-500/10"
    return "bg-muted/50"
  }

  return (
    <div className="space-y-4">
      {/* Confidence Meter */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-accent" />
            Confidence Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-muted rounded-full h-2">
              <div
                className="bg-accent h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(confidenceLevel, 100)}%` }}
              />
            </div>
            <span className="text-sm font-medium">{Math.round(confidenceLevel)}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Answer Quality Analysis */}
      <Card className={`bg-card border-border ${getQualityBg(analysis.quality)}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Answer Quality</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {!analysis.hasStarted ? (
            <p className="text-sm text-muted-foreground">Start speaking to see real-time feedback...</p>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <Badge className={`capitalize ${getQualityColor(analysis.quality)} bg-transparent border`}>
                  {analysis.quality}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  {analysis.hasDetailedAnswer ? (
                    <>
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Good answer depth ({analysis.wordCount} words)</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span>Keep elaborating ({analysis.wordCount} words)</span>
                    </>
                  )}
                </div>

                <div className="flex items-start gap-2">
                  {analysis.hasSpecificExamples ? (
                    <>
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Good use of specific examples</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span>Add specific examples from experience</span>
                    </>
                  )}
                </div>

                <div className="flex items-start gap-2">
                  {!analysis.hasFiller ? (
                    <>
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Minimize filler words (um, uh, like)</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span>Reduce filler words usage</span>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="bg-accent/5 border-accent/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Pro Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Pause briefly to think before answering</li>
            <li>• Use the STAR method (Situation, Task, Action, Result)</li>
            <li>• Provide specific examples from your experience</li>
            <li>• Speak at a natural pace, not too fast</li>
            <li>• Show enthusiasm about the role</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
