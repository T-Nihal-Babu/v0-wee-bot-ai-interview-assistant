"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Code2, BarChart3 } from "lucide-react"

interface CodingAssessmentSetupProps {
  onStart: (config: { language: string; difficulty: "easy" | "medium" | "hard" }) => void
}

const LANGUAGES = ["JavaScript", "Python", "Java", "C++", "HTML/CSS"]
const DIFFICULTIES = ["easy", "medium", "hard"]

export default function CodingAssessmentSetup({ onStart }: CodingAssessmentSetupProps) {
  const [selectedLanguage, setSelectedLanguage] = useState("JavaScript")
  const [selectedDifficulty, setSelectedDifficulty] = useState<"easy" | "medium" | "hard">("easy")

  const difficultyDescriptions = {
    easy: "Fundamental algorithms and data structures",
    medium: "More complex problems requiring optimization",
    hard: "Advanced algorithms and system design",
  }

  const handleStart = () => {
    onStart({
      language: selectedLanguage.toLowerCase().replace("/", ""),
      difficulty: selectedDifficulty,
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-2">Customize Your Coding Challenge</h2>
          <p className="text-muted-foreground">
            Choose your preferred programming language and difficulty level to get started
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Language Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-accent" />
              Programming Language
            </h3>
            <div className="space-y-2">
              {LANGUAGES.map((lang) => (
                <Card
                  key={lang}
                  className={`cursor-pointer transition-all ${
                    selectedLanguage === lang ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
                  }`}
                  onClick={() => setSelectedLanguage(lang)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="language"
                        value={lang}
                        checked={selectedLanguage === lang}
                        onChange={() => setSelectedLanguage(lang)}
                        className="cursor-pointer"
                      />
                      <span className="font-medium">{lang}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-accent" />
              Difficulty Level
            </h3>
            <div className="space-y-3">
              {DIFFICULTIES.map((difficulty) => (
                <Card
                  key={difficulty}
                  className={`cursor-pointer transition-all ${
                    selectedDifficulty === difficulty
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-accent/50"
                  }`}
                  onClick={() => setSelectedDifficulty(difficulty as "easy" | "medium" | "hard")}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="difficulty"
                        value={difficulty}
                        checked={selectedDifficulty === difficulty}
                        onChange={() => setSelectedDifficulty(difficulty as "easy" | "medium" | "hard")}
                        className="mt-1 cursor-pointer"
                      />
                      <div className="flex-1">
                        <p className="font-medium capitalize">{difficulty}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {difficultyDescriptions[difficulty as keyof typeof difficultyDescriptions]}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Session Info */}
        <Card className="bg-accent/5 border-accent/20 mt-8">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium text-foreground mb-1">Language</p>
                <p className="text-muted-foreground">{selectedLanguage}</p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Difficulty</p>
                <p className="text-muted-foreground capitalize">{selectedDifficulty}</p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Problems</p>
                <p className="text-muted-foreground">3 problems</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Start Button */}
        <div className="mt-8 text-center">
          <Button onClick={handleStart} size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-8">
            <Code2 className="w-5 h-5 mr-2" />
            Start Coding Challenge
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
