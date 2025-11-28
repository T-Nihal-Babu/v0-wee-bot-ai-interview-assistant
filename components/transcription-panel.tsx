"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, AlertCircle } from "lucide-react"

interface TranscriptionPanelProps {
  transcript: string
  isListening: boolean
  onTranscriptUpdate: (transcript: string) => void
}

export function TranscriptionPanel({ transcript, isListening, onTranscriptUpdate }: TranscriptionPanelProps) {
  const recognitionRef = useRef<any>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isActive, setIsActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSupported, setIsSupported] = useState(true)
  const interimTranscriptRef = useRef("")

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      setIsSupported(false)
      console.warn("Speech Recognition not supported")
      return
    }

    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.continuous = true
    recognitionRef.current.interimResults = true
    recognitionRef.current.lang = "en-US"
    recognitionRef.current.maxAlternatives = 1
    // Increase timeout to allow for natural speech pauses
    recognitionRef.current.silenceEndThreshold = 8000 // 8 seconds of silence before stopping

    recognitionRef.current.onstart = () => {
      console.log("[v0] Speech recognition started")
      setError(null)
      setIsActive(true)
    }

    recognitionRef.current.onresult = (event: any) => {
      interimTranscriptRef.current = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript

        if (event.results[i].isFinal) {
          onTranscriptUpdate((prev) => {
            const trimmed = (prev + " " + transcriptPart).trim()
            return trimmed.endsWith(".") ? trimmed : trimmed + ". "
          })
        } else {
          interimTranscriptRef.current += transcriptPart + " "
        }
      }
    }

    recognitionRef.current.onerror = (event: any) => {
      console.error("[v0] Speech recognition error:", event.error)

      const errorMessages: Record<string, string> = {
        "no-speech": "No speech detected. Please ensure your microphone is working and try again.",
        network: "Network error. Please check your connection.",
        "not-allowed": "Microphone permission denied. Please allow access to continue.",
        "service-not-allowed": "Speech recognition service not allowed.",
        "bad-grammar": "Grammar error in speech recognition.",
        "audio-capture": "No microphone found. Please check your audio input device.",
      }

      const message = errorMessages[event.error] || `Speech recognition error: ${event.error}`
      setError(message)
      setIsActive(false)
    }

    recognitionRef.current.onend = () => {
      console.log("[v0] Speech recognition ended")
      setIsActive(false)
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (e) {
          console.error("[v0] Error stopping recognition:", e)
        }
      }
    }
  }, [onTranscriptUpdate])

  const handleStartListening = () => {
    if (recognitionRef.current && isSupported) {
      setError(null)
      try {
        recognitionRef.current.start()
      } catch (e) {
        console.error("[v0] Error starting recognition:", e)
        setError("Failed to start microphone. Please try again.")
      }
    }
  }

  const handleStopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (e) {
        console.error("[v0] Error stopping recognition:", e)
      }
    }
  }

  // Auto-start when component mounts and isListening is true
  useEffect(() => {
    if (isListening && isSupported && recognitionRef.current) {
      handleStartListening()
    }
  }, [isListening, isSupported])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [transcript])

  if (!isSupported) {
    return (
      <Card className="p-6 bg-card border border-destructive flex flex-col flex-1 min-h-64">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-destructive" />
          <h3 className="font-semibold">Speech Recognition Not Supported</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Your browser doesn't support speech recognition. Please use Chrome, Firefox, Edge, or Safari.
        </p>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-card border border-border flex flex-col flex-1 min-h-64">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Real-time Transcription</h3>
        <div className="flex items-center gap-2">
          <Badge variant={isActive ? "default" : "secondary"}>{isActive ? "Listening..." : "Ready"}</Badge>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div
        ref={scrollRef}
        className="flex-1 bg-background/50 rounded-md p-4 text-sm leading-relaxed text-foreground overflow-y-auto mb-4"
      >
        <div>
          {transcript || (
            <span className="text-muted-foreground/50">Your transcript will appear here as you speak...</span>
          )}
          {interimTranscriptRef.current && (
            <span className="text-muted-foreground italic ml-2">{interimTranscriptRef.current}</span>
          )}
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <Button
          onClick={handleStartListening}
          disabled={isActive}
          variant={isActive ? "secondary" : "default"}
          size="sm"
          className="flex-1"
        >
          <Mic className="w-4 h-4 mr-2" />
          Start
        </Button>
        <Button onClick={handleStopListening} disabled={!isActive} variant="secondary" size="sm" className="flex-1">
          <MicOff className="w-4 h-4 mr-2" />
          Stop
        </Button>
      </div>

      <div className="text-xs text-muted-foreground">
        Characters: {transcript.length} | Words: {transcript.split(/\s+/).filter((w) => w).length}
      </div>
    </Card>
  )
}
