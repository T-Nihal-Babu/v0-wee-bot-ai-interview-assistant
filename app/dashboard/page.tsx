"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getCurrentUser, logoutUser } from "@/lib/auth"
import { getSessions } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Brain, Code2, Settings, LogOut, Target } from "lucide-react"
import DashboardSidebar from "@/components/dashboard-sidebar"
import ProgressOverview from "@/components/progress-overview"
import RecentSessions from "@/components/recent-sessions"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/auth")
      return
    }
    setUser(currentUser)

    const allSessions = getSessions()
    setSessions(allSessions.slice(-5))
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    logoutUser()
    router.push("/auth")
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <DashboardSidebar user={user} onLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Navigation */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40 p-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-sm text-muted-foreground">Welcome back, {user.username}</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="secondary" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6 max-w-7xl mx-auto">
          {/* Progress Overview */}
          <div className="mb-8">
            <ProgressOverview user={user} />
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 gap-6 mb-8"
          >
            {/* Start Communication Assessment */}
            <Link href="/communication">
              <Card className="bg-card border-border hover:border-accent transition-all cursor-pointer group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="w-5 h-5 text-accent" />
                        Communication
                      </CardTitle>
                      <CardDescription>Practice interview skills</CardDescription>
                    </div>
                    <Target className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Master communication skills with AI-powered feedback and real-time analysis.
                  </p>
                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Start Session</Button>
                </CardContent>
              </Card>
            </Link>

            {/* Start Coding Assessment */}
            <Link href="/coding">
              <Card className="bg-card border-border hover:border-accent transition-all cursor-pointer group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Code2 className="w-5 h-5 text-accent" />
                        Coding
                      </CardTitle>
                      <CardDescription>Solve coding challenges</CardDescription>
                    </div>
                    <Target className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Challenge yourself with problems and get AI-powered code optimization suggestions.
                  </p>
                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Start Session</Button>
                </CardContent>
              </Card>
            </Link>
          </motion.div>

          {/* Recent Sessions */}
          <RecentSessions sessions={sessions} />
        </div>
      </div>
    </div>
  )
}
