"use client"

import { useState, useRef } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { VideoRecorder } from "@/components/video-recorder"
import { TranscriptionPanel } from "@/components/transcription-panel"
import { QuestionsPanel } from "@/components/questions-panel"
import { SessionSummary } from "@/components/session-summary"
import { generateInterviewQuestion } from "@/lib/gemini"
import { Mic, StopCircle } from "lucide-react"

type SessionState = "idle" | "recording" | "completed"

export default function CommunicationPage() {
  const [sessionState, setSessionState] = useState<SessionState>("idle")
  const [transcript, setTranscript] = useState<string>("")
  const [currentQuestion, setCurrentQuestion] = useState<string>("")
  const [questions, setQuestions] = useState<string[]>([])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false)
  const [sessionData, setSessionData] = useState({
    startTime: new Date(),
    videoBlob: null as Blob | null,
    transcript: "",
    questionsAnswered: 0,
  })
  const videoRecorderRef = useRef<any>(null)
  const totalQuestions = 3

  const startSession = async () => {
    setSessionState("recording")
    setTranscript("")
    setQuestionIndex(0)
    setQuestions([])
    setSessionData({
      startTime: new Date(),
      videoBlob: null,
      transcript: "",
      questionsAnswered: 0,
    })

    await loadNextQuestion(0)
  }

  const loadNextQuestion = async (currentIndex: number) => {
    try {
      setIsLoadingQuestion(true)

      if (currentIndex < totalQuestions) {
        const question = await generateInterviewQuestion(
          "Software Engineer Interview",
          currentIndex + 1,
          totalQuestions,
        )

        setCurrentQuestion(question)
        setQuestions((prev) => [...prev, question])
        setQuestionIndex(currentIndex + 1)
      } else {
        endSession()
      }
    } catch (error) {
      console.error("Error loading question:", error)
      // Fallback to mock question
      const mockQuestions = [
        "Tell me about your most challenging project and how you overcame the difficulties.",
        "Describe a time when you had to work with a difficult team member. How did you handle it?",
        "What are your career goals for the next 5 years?",
      ]

      if (currentIndex < mockQuestions.length) {
        setCurrentQuestion(mockQuestions[currentIndex])
        setQuestions((prev) => [...prev, mockQuestions[currentIndex]])
        setQuestionIndex(currentIndex + 1)
      }
    } finally {
      setIsLoadingQuestion(false)
    }
  }

  const skipQuestion = () => {
    loadNextQuestion(questionIndex)
  }

  const endSession = () => {
    setSessionState("completed")
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
            onReset={() => {
              setSessionState("idle")
              setTranscript("")
              setCurrentQuestion("")
            }}
          />
        </main>
      </>
    )
  }

  if (sessionState === "recording") {
    return (
      <>
        <Header title="Communication Assessment" description="Live session in progress" showBackButton={false} />
        <main className="container mx-auto px-4 py-6">
          <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
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

            {/* Right: Questions & Transcription */}
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
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header title="Communication Assessment" description="Practice your interview communication skills" />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8">
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">Ready to Start?</h2>
                <p className="text-muted-foreground">
                  In this session, you'll be asked {totalQuestions} AI-generated interview questions. Answer each
                  question while your video and audio are being recorded.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6 text-left space-y-3">
                <h3 className="font-semibold">What to expect:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ AI-generated interview questions tailored to your role</li>
                  <li>✓ Your camera feed will be recorded</li>
                  <li>✓ Your speech will be transcribed in real-time</li>
                  <li>✓ You'll get detailed feedback after the session</li>
                  <li>✓ Each answer is typically 2-3 minutes</li>
                </ul>
              </div>

              <Button
                onClick={startSession}
                size="lg"
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <Mic className="w-5 h-5 mr-2" />
                Start Session
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </>
  )
}
