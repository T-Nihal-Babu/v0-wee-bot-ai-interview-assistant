"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { analyzeCommunicationMetrics } from "@/lib/gemini"
import { Loader2, Lightbulb, CheckCircle2, AlertCircle } from "lucide-react"

interface AIFeedbackPanelProps {
  transcript: string
  isLoading?: boolean
}

export default function AIFeedbackPanel({ transcript, isLoading = false }: AIFeedbackPanelProps) {
  const [metrics, setMetrics] = useState<any>(null)
  const [analyzing, setAnalyzing] = useState(false)

  useEffect(() => {
    if (transcript && transcript.length > 100 && !analyzing) {
      analyzeTranscript()
    }
  }, [transcript])

  const analyzeTranscript = async () => {
    setAnalyzing(true)
    try {
      const result = await analyzeCommunicationMetrics(transcript)
      setMetrics(result)
    } catch (error) {
      console.error("Error analyzing transcript:", error)
    } finally {
      setAnalyzing(false)
    }
  }

  const getMetricColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  const getMetricBg = (score: number) => {
    if (score >= 80) return "bg-green-500/10"
    if (score >= 60) return "bg-yellow-500/10"
    return "bg-red-500/10"
  }

  if (isLoading || analyzing) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">AI Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-accent mr-2" />
            <span className="text-muted-foreground">Analyzing your response...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!metrics) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">AI Analysis</CardTitle>
          <CardDescription>Speak longer for detailed analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Keep speaking to receive AI-powered feedback on your response quality.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(metrics).map(([key, value]) => {
            const score = value as number
            const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())

            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-muted-foreground">{label}</span>
                  <span className={`text-sm font-bold ${getMetricColor(score)}`}>{score}%</span>
                </div>
                <div className={`w-full h-2 rounded-full ${getMetricBg(score)}`}>
                  <div
                    className={`h-full rounded-full ${score >= 80 ? "bg-green-500" : score >= 60 ? "bg-yellow-500" : "bg-red-500"}`}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Card className="bg-accent/5 border-accent/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-accent" />
            AI Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Great use of specific examples</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
              <span>Work on pacing - speak a bit slower</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Strong structure to your answer</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
