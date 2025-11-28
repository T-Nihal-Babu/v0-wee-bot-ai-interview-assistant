"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Brain, Code2, ArrowRight, TrendingUp } from "lucide-react"
import { getCurrentUser, logoutUser } from "@/lib/auth"

export default function Home() {
  const router = useRouter()
  const user = getCurrentUser()

  const handleLogout = () => {
    logoutUser()
    router.refresh()
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-card">
      {/* Navigation Bar */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
            WeeBot
          </div>
          <div className="flex items-center gap-4">
            {user && <span className="text-sm text-muted-foreground">Welcome, {user.username}</span>}
            {!user && (
              <Link href="/auth">
                <Button variant="secondary" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-20">
        {/* Header */}
        <motion.div className="mb-16 text-center" variants={containerVariants} initial="hidden" animate="visible">
          <motion.div variants={itemVariants} className="mb-6">
            <h1 className="text-5xl md:text-7xl font-bold text-balance mb-4">
              <span className="bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
                WeeBot
              </span>
            </h1>
            <p className="text-xl text-muted-foreground text-balance">Your AI-powered interview assistant</p>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance mb-12"
          >
            Master communication skills and coding challenges with intelligent AI coaching. Real-time feedback, detailed
            analytics, and personalized learning paths.
          </motion.p>
        </motion.div>

        {/* Skill Selection Cards */}
        <motion.div
          className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Communication Skills Card */}
          <motion.div variants={itemVariants} className="group">
            <Link href="/communication">
              <div className="h-full bg-card border border-border rounded-lg p-8 hover:border-accent transition-all duration-300 cursor-pointer hover:bg-card/80">
                <div className="flex items-start justify-between mb-6">
                  <div className="p-3 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                    <Brain className="w-6 h-6 text-accent" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Communication Skills</h2>
                <p className="text-muted-foreground mb-6">
                  Practice live interview scenarios with AI-generated questions, video recording, and real-time speech
                  analysis.
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div>✓ Live webcam recording</div>
                  <div>✓ AI-generated questions</div>
                  <div>✓ Real-time transcription</div>
                  <div>✓ Performance metrics</div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Coding Skills Card */}
          <motion.div variants={itemVariants} className="group">
            <Link href="/coding">
              <div className="h-full bg-card border border-border rounded-lg p-8 hover:border-accent transition-all duration-300 cursor-pointer hover:bg-card/80">
                <div className="flex items-start justify-between mb-6">
                  <div className="p-3 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                    <Code2 className="w-6 h-6 text-accent" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Coding Skills</h2>
                <p className="text-muted-foreground mb-6">
                  Solve coding challenges in a professional IDE-like environment with syntax highlighting and test
                  execution.
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div>✓ Code editor with syntax highlighting</div>
                  <div>✓ Problem statements & test cases</div>
                  <div>✓ Real-time execution</div>
                  <div>✓ Progress tracking</div>
                </div>
              </div>
            </Link>
          </motion.div>
        </motion.div>

        {/* CTA Section */}
        <motion.div className="text-center" variants={itemVariants} initial="hidden" animate="visible">
          <p className="text-sm text-muted-foreground mb-4">Ready to ace your next interview?</p>
          <div className="flex gap-4 justify-center">
            <Link href={user ? "/dashboard" : "/auth"}>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground px-8">
                {user ? "Go to Dashboard" : "Get Started"}
              </Button>
            </Link>
            {user && (
              <Link href="/progress">
                <Button variant="secondary" size="lg">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Progress
                </Button>
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  )
}
