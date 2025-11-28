"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Target, BarChart3, Zap } from "lucide-react"

interface AssessmentSetupProps {
  jobRoles: string[]
  onStart: (config: { level: "beginner" | "intermediate" | "advanced"; jobRole: string }) => void
  assessmentType: "communication" | "coding"
}

type Level = "beginner" | "intermediate" | "advanced"

export default function AssessmentSetup({ jobRoles, onStart, assessmentType }: AssessmentSetupProps) {
  const [selectedLevel, setSelectedLevel] = useState<Level>("intermediate")
  const [selectedRole, setSelectedRole] = useState(jobRoles[0])

  const levelDescriptions = {
    beginner: "Foundational questions focusing on basics and general competencies",
    intermediate: "Standard interview questions with moderate complexity",
    advanced: "Complex scenario-based questions and system design problems",
  }

  const levels: Level[] = ["beginner", "intermediate", "advanced"]

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-2">Customize Your Assessment</h2>
          <p className="text-muted-foreground">
            Select your experience level and target role to get personalized interview questions
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Difficulty Level Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-accent" />
              Experience Level
            </h3>
            <div className="space-y-3">
              {levels.map((level) => (
                <Card
                  key={level}
                  className={`cursor-pointer transition-all ${
                    selectedLevel === level ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
                  }`}
                  onClick={() => setSelectedLevel(level)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="level"
                        value={level}
                        checked={selectedLevel === level}
                        onChange={() => setSelectedLevel(level)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <p className="font-medium capitalize">{level}</p>
                        <p className="text-xs text-muted-foreground mt-1">{levelDescriptions[level]}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Job Role Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-accent" />
              Target Role
            </h3>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full bg-input border border-border rounded-lg p-3 text-foreground mb-4 focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {jobRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>

            <Card className="bg-muted/50 border-border">
              <CardContent className="p-4">
                <div className="space-y-2 text-sm">
                  <p className="font-medium">Session Details:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>✓ 5 AI-generated interview questions</li>
                    <li>✓ Real-time speech transcription</li>
                    <li>✓ Video and audio recording</li>
                    <li>✓ Detailed performance feedback</li>
                    <li>✓ Typical duration: 15-20 minutes</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Start Button */}
        <div className="mt-8 text-center">
          <Button
            onClick={() => onStart({ level: selectedLevel, jobRole: selectedRole })}
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground px-8"
          >
            <Zap className="w-5 h-5 mr-2" />
            Start Assessment
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
