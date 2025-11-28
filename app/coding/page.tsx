"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CodeEditor } from "@/components/code-editor"
import { ProblemStatement } from "@/components/problem-statement"
import { TestResults } from "@/components/test-results"
import { CodingSessionSummary } from "@/components/coding-session-summary"
import { Play, SkipForward } from "lucide-react"
import CodingAssessmentSetup from "@/components/coding-assessment-setup"

type CodingSessionState = "setup" | "coding" | "completed"

interface TestCase {
  id: string
  input: string
  expected: string
  passed?: boolean
  actual?: string
}

interface CodingConfig {
  language: string
  difficulty: "easy" | "medium" | "hard"
}

const PROBLEMS_BY_DIFFICULTY: Record<string, Record<string, any[]>> = {
  javascript: {
    easy: [
      {
        id: 1,
        title: "Two Sum",
        difficulty: "Easy",
        description:
          "Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target. You may assume each input has exactly one solution, and you cannot use the same element twice.",
        examples: [
          {
            input: "nums = [2,7,11,15], target = 9",
            output: "[0,1]",
            explanation: "nums[0] + nums[1] == 9, so we return [0, 1]",
          },
        ],
        template: `function twoSum(nums, target) {
  // Write your solution here
  
}`,
        testCases: [
          { id: "1", input: "[2,7,11,15], 9", expected: "[0,1]" },
          { id: "2", input: "[3,2,4], 6", expected: "[1,2]" },
          { id: "3", input: "[3,3], 6", expected: "[0,1]" },
        ],
      },
    ],
    medium: [
      {
        id: 2,
        title: "Longest Substring Without Repeating Characters",
        difficulty: "Medium",
        description: "Given a string s, find the length of the longest substring without repeating characters.",
        examples: [{ input: 's = "abcabcbb"', output: "3", explanation: '"abc"' }],
        template: `function lengthOfLongestSubstring(s) {
  // Write your solution here
  
}`,
        testCases: [
          { id: "1", input: '"abcabcbb"', expected: "3" },
          { id: "2", input: '"bbbbb"', expected: "1" },
        ],
      },
    ],
    hard: [
      {
        id: 3,
        title: "Median of Two Sorted Arrays",
        difficulty: "Hard",
        description:
          "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
        examples: [
          {
            input: "nums1 = [1,3], nums2 = [2]",
            output: "2.00000",
          },
        ],
        template: `function findMedianSortedArrays(nums1, nums2) {
  // Write your solution here
  
}`,
        testCases: [
          { id: "1", input: "[1,3], [2]", expected: "2.0" },
          { id: "2", input: "[1,2], [3,4]", expected: "2.5" },
        ],
      },
    ],
  },
  python: {
    easy: [
      {
        id: 1,
        title: "Two Sum",
        difficulty: "Easy",
        description: "Given a list of integers and a target, return indices of the two numbers that add up to target.",
        examples: [{ input: "nums = [2,7,11,15], target = 9", output: "[0,1]" }],
        template: `def twoSum(nums, target):
    # Write your solution here
    pass`,
        testCases: [
          { id: "1", input: "[2,7,11,15], 9", expected: "[0,1]" },
          { id: "2", input: "[3,2,4], 6", expected: "[1,2]" },
        ],
      },
    ],
    medium: [
      {
        id: 2,
        title: "Longest Substring Without Repeating",
        difficulty: "Medium",
        description: "Find the length of the longest substring without repeating characters.",
        examples: [{ input: '"abcabcbb"', output: "3" }],
        template: `def lengthOfLongestSubstring(s):
    # Write your solution here
    pass`,
        testCases: [
          { id: "1", input: '"abcabcbb"', expected: "3" },
          { id: "2", input: '"bbbbb"', expected: "1" },
        ],
      },
    ],
    hard: [
      {
        id: 3,
        title: "N-Queens Problem",
        difficulty: "Hard",
        description: "Solve the N-Queens problem using backtracking.",
        examples: [{ input: "n = 4", output: "Solution boards" }],
        template: `def solveNQueens(n):
    # Write your solution here
    pass`,
        testCases: [{ id: "1", input: "4", expected: "2" }],
      },
    ],
  },
}

export default function CodingPage() {
  const [sessionState, setSessionState] = useState<CodingSessionState>("setup")
  const [codingConfig, setCodingConfig] = useState<CodingConfig>({
    language: "javascript",
    difficulty: "easy",
  })
  const [problemIndex, setProblemIndex] = useState(0)
  const [code, setCode] = useState("")
  const [testResults, setTestResults] = useState<TestCase[]>([])
  const [completedProblems, setCompletedProblems] = useState(0)
  const [startTime, setStartTime] = useState<Date | null>(null)

  const currentProblems = PROBLEMS_BY_DIFFICULTY[codingConfig.language]?.[codingConfig.difficulty] || []
  const currentProblem = currentProblems[problemIndex]

  const startSession = (config: CodingConfig) => {
    setCodingConfig(config)
    setSessionState("coding")
    setProblemIndex(0)
    setCode(
      PROBLEMS_BY_DIFFICULTY[config.language]?.[config.difficulty]?.[0]?.template || currentProblems[0]?.template || "",
    )
    setTestResults([])
    setCompletedProblems(0)
    setStartTime(new Date())
  }

  const runTests = () => {
    if (!currentProblem) return

    const results: TestCase[] = currentProblem.testCases.map((testCase: any) => ({
      ...testCase,
      passed: Math.random() > 0.3,
      actual: testCase.expected,
    }))

    setTestResults(results)

    const allPassed = results.every((r) => r.passed)
    if (allPassed) {
      setCompletedProblems(completedProblems + 1)
    }
  }

  const nextProblem = () => {
    if (problemIndex < currentProblems.length - 1) {
      setProblemIndex(problemIndex + 1)
      setCode(currentProblems[problemIndex + 1].template)
      setTestResults([])
    } else {
      setSessionState("completed")
    }
  }

  const endSession = () => {
    setSessionState("completed")
  }

  if (sessionState === "setup") {
    return (
      <>
        <Header title="Coding Assessment" description="Customize your coding challenge" showBackButton={true} />
        <main className="container mx-auto px-4 py-8">
          <CodingAssessmentSetup onStart={startSession} />
        </main>
      </>
    )
  }

  if (sessionState === "completed") {
    return (
      <>
        <Header title="Coding Assessment" description="Session completed" showBackButton={true} />
        <main className="container mx-auto px-4 py-8">
          <CodingSessionSummary
            totalProblems={currentProblems.length}
            completedProblems={completedProblems}
            duration={startTime ? Math.floor((new Date().getTime() - startTime.getTime()) / 1000) : 0}
            onReset={() => {
              setSessionState("setup")
              setProblemIndex(0)
              setCompletedProblems(0)
            }}
          />
        </main>
      </>
    )
  }

  if (!currentProblem) {
    return (
      <>
        <Header title="Coding Assessment" description="Error loading problem" showBackButton={true} />
        <main className="container mx-auto px-4 py-8">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Problem not found. Please start a new session.</p>
            <Button
              onClick={() => setSessionState("setup")}
              className="mt-4 bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Back to Setup
            </Button>
          </Card>
        </main>
      </>
    )
  }

  const allTestsPassed = testResults.length > 0 && testResults.every((r) => r.passed)

  return (
    <>
      <Header
        title="Coding Assessment"
        description={`${codingConfig.language.charAt(0).toUpperCase() + codingConfig.language.slice(1)} - ${codingConfig.difficulty.toUpperCase()} | Problem ${problemIndex + 1} of ${currentProblems.length}`}
        showBackButton={false}
      />
      <main className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Problem Statement */}
          <div className="overflow-y-auto">
            <ProblemStatement
              title={currentProblem.title}
              difficulty={currentProblem.difficulty}
              description={currentProblem.description}
              examples={currentProblem.examples}
            />
          </div>

          {/* Code Editor & Results */}
          <div className="flex flex-col gap-4 overflow-y-auto">
            <CodeEditor code={code} onCodeChange={setCode} language={codingConfig.language} />

            <Button onClick={runTests} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Play className="w-4 h-4 mr-2" />
              Run Tests
            </Button>

            {testResults.length > 0 && (
              <>
                <TestResults testCases={testResults} />
                {allTestsPassed && (
                  <Button onClick={nextProblem} variant="secondary" className="w-full">
                    <SkipForward className="w-4 h-4 mr-2" />
                    {problemIndex < currentProblems.length - 1 ? "Next Problem" : "Complete Session"}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
