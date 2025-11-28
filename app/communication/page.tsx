"use client"

import { useState, useRef } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { VideoRecorder } from "@/components/video-recorder"
import { TranscriptionPanel } from "@/components/transcription-panel"
import { QuestionsPanel } from "@/components/questions-panel"
import { SessionSummary } from "@/components/session-summary"
import { generateInterviewQuestion } from "@/lib/gemini"
import { StopCircle } from "lucide-react"
import AssessmentSetup from "@/components/assessment-setup"
import RealtimeFeedback from "@/components/realtime-feedback"

type SessionState = "setup" | "recording" | "completed"

interface SessionConfig {
  level: "beginner" | "intermediate" | "advanced"
  jobRole: string
}

const JOB_ROLES = [
  "Web Developer",
  "AI Engineer",
  "Data Scientist",
  "DevOps Engineer",
  "Full Stack Developer",
  "Cloud Architect",
  "Mobile Developer",
]

export default function CommunicationPage() {
  const [sessionState, setSessionState] = useState<SessionState>("setup")
  const [sessionConfig, setSessionConfig] = useState<SessionConfig>({
    level: "intermediate",
    jobRole: "Web Developer",
  })
  const [transcript, setTranscript] = useState<string>("")
  const [currentQuestion, setCurrentQuestion] = useState<string>("")
  const [questions, setQuestions] = useState<string[]>([])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false)
  const [feedback, setFeedback] = useState<any>(null)
  const [sessionData, setSessionData] = useState({
    startTime: new Date(),
    videoBlob: null as Blob | null,
    transcript: "",
    questionsAnswered: 0,
  })
  const videoRecorderRef = useRef<any>(null)
  const totalQuestions = 5

  const startSession = async (config: SessionConfig) => {
    setSessionConfig(config)
    setSessionState("recording")
    setTranscript("")
    setQuestionIndex(0)
    setQuestions([])
    setFeedback(null)
    setSessionData({
      startTime: new Date(),
      videoBlob: null,
      transcript: "",
      questionsAnswered: 0,
    })

    await loadNextQuestion(0, config)
  }

  const loadNextQuestion = async (currentIndex: number, config: SessionConfig) => {
    try {
      setIsLoadingQuestion(true)

      if (currentIndex < totalQuestions) {
        const context = `${config.jobRole} Interview - ${config.level} Level`
        const question = await generateInterviewQuestion(context, currentIndex + 1, totalQuestions)

        setCurrentQuestion(question)
        setQuestions((prev) => [...prev, question])
        setQuestionIndex(currentIndex + 1)
      } else {
        endSession()
      }
    } catch (error) {
      console.error("Error loading question:", error)

      const mockQuestions: Record<string, string[]> = {
        beginner: [
          "Tell me about yourself and your background in " + config.jobRole.toLowerCase(),
          "What motivated you to pursue a career in " + config.jobRole.toLowerCase() + "?",
          "Describe a project you worked on that you're proud of.",
          "What are some key skills you believe are important for this role?",
          "Where do you see yourself in 5 years?",
        ],
        intermediate: [
          "Tell me about your most challenging project in " +
            config.jobRole.toLowerCase() +
            " and how you overcame it.",
          "Describe a time when you had to learn a new technology quickly. How did you approach it?",
          "How do you stay updated with the latest trends in " + config.jobRole.toLowerCase() + "?",
          "Tell me about a time you had to work with a difficult team member. How did you handle it?",
          "What are your career aspirations in the next 5 years?",
        ],
        advanced: [
          "Describe your most complex project and the architectural decisions you made.",
          "How do you approach system design and scalability challenges?",
          "Tell me about a time you led a technical initiative. What was the outcome?",
          "How do you mentor junior developers and contribute to team growth?",
          "What's your vision for the future of " + config.jobRole.toLowerCase() + "?",
        ],
      }

      const questions = mockQuestions[config.level] || mockQuestions.intermediate
      if (currentIndex < questions.length) {
        setCurrentQuestion(questions[currentIndex])
        setQuestions((prev) => [...prev, questions[currentIndex]])
        setQuestionIndex(currentIndex + 1)
      }
    } finally {
      setIsLoadingQuestion(false)
    }
  }

  const skipQuestion = () => {
    loadNextQuestion(questionIndex, sessionConfig)
  }

  const endSession = () => {
    setSessionState("completed")
  }

  if (sessionState === "setup") {
    return (
      <>
        <Header title="Communication Assessment" description="Practice your interview skills" showBackButton={true} />
        <main className="container mx-auto px-4 py-8">
          <AssessmentSetup jobRoles={JOB_ROLES} onStart={startSession} assessmentType="communication" />
        </main>
      </>
    )
  }

  if (sessionState === "completed") {
    return (
      <>
        <Header title="Communication Assessment" description="Session completed" showBackButton={true} />
        <main className="container mx-auto px-4 py-8">
          <SessionSummary
            transcript={transcript}
            duration={Math.floor((new Date().getTime() - sessionData.startTime.getTime()) / 1000)}
            questionsAnswered={questionIndex}
            level={sessionConfig.level}
            jobRole={sessionConfig.jobRole}
            onReset={() => {
              setSessionState("setup")
              setTranscript("")
              setCurrentQuestion("")
            }}
          />
        </main>
      </>
    )
  }

  return (
    <>
      <Header title="Communication Assessment" description="Live session in progress" showBackButton={false} />
      <main className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-4 h-[calc(100vh-200px)]">
          {/* Left: Video Recording */}
          <div className="flex flex-col gap-4">
            <VideoRecorder ref={videoRecorderRef} />
            <div className="flex gap-3">
              <Button onClick={endSession} variant="destructive" className="flex-1">
                <StopCircle className="w-4 h-4 mr-2" />
                End Session
              </Button>
            </div>
          </div>

          {/* Center: Questions & Transcription */}
          <div className="flex flex-col gap-4 overflow-y-auto">
            <QuestionsPanel
              currentQuestion={currentQuestion}
              questionNumber={questionIndex}
              totalQuestions={totalQuestions}
              onSkip={skipQuestion}
              isLoading={isLoadingQuestion}
            />
            <TranscriptionPanel
              transcript={transcript}
              isListening={sessionState === "recording"}
              onTranscriptUpdate={setTranscript}
            />
          </div>

          {/* Right: Real-time Feedback */}
          <div className="flex flex-col gap-4 overflow-y-auto">
            <RealtimeFeedback
              transcript={transcript}
              questionNumber={questionIndex}
              confidenceLevel={transcript.length > 50 ? Math.min(100, 70 + (transcript.length / 500) * 30) : 50}
            />
          </div>
        </div>
      </main>
    </>
  )
}
