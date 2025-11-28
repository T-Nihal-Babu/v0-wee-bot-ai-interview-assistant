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

type CodingSessionState = "idle" | "coding" | "completed"

interface TestCase {
  id: string
  input: string
  expected: string
  passed?: boolean
  actual?: string
}

const PROBLEMS = [
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
  {
    id: 2,
    title: "Palindrome Number",
    difficulty: "Easy",
    description: "Given an integer x, return true if x is a palindrome, and false otherwise.",
    examples: [
      { input: "x = 121", output: "true" },
      { input: "x = -121", output: "false" },
    ],
    template: `function isPalindrome(x) {
  // Write your solution here
  
}`,
    testCases: [
      { id: "1", input: "121", expected: "true" },
      { id: "2", input: "-121", expected: "false" },
      { id: "3", input: "10", expected: "false" },
    ],
  },
  {
    id: 3,
    title: "Reverse String",
    difficulty: "Easy",
    description: "Write a function that reverses a string. The input string is given as an array of characters s.",
    examples: [{ input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' }],
    template: `function reverseString(s) {
  // Write your solution here
  
}`,
    testCases: [
      { id: "1", input: '["h","e","l","l","o"]', expected: '["o","l","l","e","h"]' },
      { id: "2", input: '["H","a","n","n","a","h"]', expected: '["h","a","n","n","a","H"]' },
    ],
  },
]

export default function CodingPage() {
  const [sessionState, setSessionState] = useState<CodingSessionState>("idle")
  const [problemIndex, setProblemIndex] = useState(0)
  const [code, setCode] = useState(PROBLEMS[0].template)
  const [testResults, setTestResults] = useState<TestCase[]>([])
  const [completedProblems, setCompletedProblems] = useState(0)
  const [startTime, setStartTime] = useState<Date | null>(null)

  const currentProblem = PROBLEMS[problemIndex]

  const startSession = () => {
    setSessionState("coding")
    setCode(currentProblem.template)
    setTestResults([])
    setStartTime(new Date())
  }

  const runTests = () => {
    // Mock test execution - in production, would execute actual code
    const results: TestCase[] = currentProblem.testCases.map((testCase) => ({
      ...testCase,
      passed: Math.random() > 0.3, // Simulate some passing tests
      actual: testCase.expected, // In production, would be actual execution result
    }))

    setTestResults(results)

    // Check if all tests passed
    const allPassed = results.every((r) => r.passed)
    if (allPassed) {
      setCompletedProblems(completedProblems + 1)
    }
  }

  const nextProblem = () => {
    if (problemIndex < PROBLEMS.length - 1) {
      setProblemIndex(problemIndex + 1)
      setCode(PROBLEMS[problemIndex + 1].template)
      setTestResults([])
    } else {
      setSessionState("completed")
    }
  }

  const endSession = () => {
    setSessionState("completed")
  }

  if (sessionState === "completed") {
    return (
      <>
        <Header title="Coding Assessment" description="Session completed" showBackButton={true} />
        <main className="container mx-auto px-4 py-8">
          <CodingSessionSummary
            totalProblems={PROBLEMS.length}
            completedProblems={completedProblems}
            duration={startTime ? Math.floor((new Date().getTime() - startTime.getTime()) / 1000) : 0}
            onReset={() => {
              setSessionState("idle")
              setProblemIndex(0)
              setCompletedProblems(0)
            }}
          />
        </main>
      </>
    )
  }

  if (sessionState === "coding") {
    const allTestsPassed = testResults.length > 0 && testResults.every((r) => r.passed)

    return (
      <>
        <Header
          title="Coding Assessment"
          description={`Problem ${problemIndex + 1} of ${PROBLEMS.length}`}
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
              <CodeEditor code={code} onCodeChange={setCode} language="javascript" />

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
                      {problemIndex < PROBLEMS.length - 1 ? "Next Problem" : "Complete Session"}
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

  return (
    <>
      <Header title="Coding Assessment" description="Solve coding challenges in a real interview environment" />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8">
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">Ready to Code?</h2>
                <p className="text-muted-foreground">
                  In this session, you'll solve {PROBLEMS.length} coding problems. Write clean, efficient code and pass
                  all test cases for each problem.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6 text-left space-y-3">
                <h3 className="font-semibold">What to expect:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ {PROBLEMS.length} problems ranging from Easy to Medium</li>
                  <li>✓ Code editor with syntax highlighting</li>
                  <li>✓ Multiple test cases for each problem</li>
                  <li>✓ Real-time test execution and feedback</li>
                  <li>✓ Progress tracking throughout the session</li>
                </ul>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {PROBLEMS.map((p, i) => (
                  <div key={p.id} className="bg-background/50 rounded-lg p-3 text-center">
                    <div className="text-xs text-muted-foreground mb-1">Problem {i + 1}</div>
                    <div className="font-semibold text-sm">{p.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{p.difficulty}</div>
                  </div>
                ))}
              </div>

              <Button
                onClick={startSession}
                size="lg"
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Coding Session
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </>
  )
}
