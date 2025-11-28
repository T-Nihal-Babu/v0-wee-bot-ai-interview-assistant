"use client"

import { useMemo } from "react"
import { getSessions } from "@/lib/storage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { TrendingUp, Target, Award, Clock, Zap } from "lucide-react"

export default function EnhancedProgressDashboard() {
  const metrics = useMemo(() => {
    const sessions = getSessions()

    // Calculate 5 key metrics
    const communicationSessions = sessions.filter((s) => s.type === "communication")
    const codingSessions = sessions.filter((s) => s.type === "coding")

    const avgCommunicationSkills =
      communicationSessions.length > 0
        ? Math.round(
            communicationSessions.reduce((sum, s) => sum + (s.metrics?.communicationSkills || 70), 0) /
              communicationSessions.length,
          )
        : 0

    const avgVocabulary =
      communicationSessions.length > 0
        ? Math.round(
            communicationSessions.reduce((sum, s) => sum + (s.metrics?.vocabulary || 65), 0) /
              communicationSessions.length,
          )
        : 0

    const avgTechnicalSkills =
      codingSessions.length > 0
        ? Math.round(codingSessions.reduce((sum, s) => sum + (s.score || 0), 0) / codingSessions.length)
        : 0

    const avgBodyLanguage =
      communicationSessions.length > 0
        ? Math.round(
            communicationSessions.reduce((sum, s) => sum + (s.metrics?.bodyLanguage || 75), 0) /
              communicationSessions.length,
          )
        : 0

    const avgConfidence =
      communicationSessions.length > 0
        ? Math.round(
            communicationSessions.reduce((sum, s) => sum + (s.metrics?.confidence || 70), 0) /
              communicationSessions.length,
          )
        : 0

    return {
      communicationSkills: avgCommunicationSkills,
      vocabulary: avgVocabulary,
      technicalSkills: avgTechnicalSkills,
      bodyLanguage: avgBodyLanguage,
      confidence: avgConfidence,
      sessions: sessions.slice(-10).map((s, idx) => ({
        date: new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        score: s.score || (s as any).metrics?.communicationSkills || 70,
        type: s.type,
      })),
    }
  }, [])

  const radarData = [
    { subject: "Communication", value: metrics.communicationSkills },
    { subject: "Vocabulary", value: metrics.vocabulary },
    { subject: "Technical", value: metrics.technicalSkills },
    { subject: "Body Language", value: metrics.bodyLanguage },
    { subject: "Confidence", value: metrics.confidence },
  ]

  return (
    <div className="space-y-6">
      {/* 5 Key Metrics Cards */}
      <div className="grid md:grid-cols-5 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="w-4 h-4 text-accent" />
              Communication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{metrics.communicationSkills}%</div>
            <p className="text-xs text-muted-foreground mt-1">Interview skills</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              Vocabulary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{metrics.vocabulary}%</div>
            <p className="text-xs text-muted-foreground mt-1">Word choice</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Award className="w-4 h-4 text-green-500" />
              Technical
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{metrics.technicalSkills}%</div>
            <p className="text-xs text-muted-foreground mt-1">Coding ability</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              Body Language
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{metrics.bodyLanguage}%</div>
            <p className="text-xs text-muted-foreground mt-1">Non-verbal skills</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-500" />
              Confidence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">{metrics.confidence}%</div>
            <p className="text-xs text-muted-foreground mt-1">Overall poise</p>
          </CardContent>
        </Card>
      </div>

      {/* Radar Chart for Skills Overview */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Skills Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--color-border)" />
              <PolarAngleAxis dataKey="subject" stroke="var(--color-muted-foreground)" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="var(--color-border)" />
              <Radar
                name="Score"
                dataKey="value"
                stroke="var(--color-accent)"
                fill="var(--color-accent)"
                fillOpacity={0.6}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Trend */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Performance Trend</CardTitle>
        </CardHeader>
        <CardContent>
          {metrics.sessions.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={metrics.sessions}>
                <CartesianGrid stroke="var(--color-border)" />
                <XAxis dataKey="date" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="var(--color-accent)" name="Score" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              No session data yet. Start a practice session to see your progress.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
