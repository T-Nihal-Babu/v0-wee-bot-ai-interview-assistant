"use client"

import { useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TranscriptionPanelProps {
  transcript: string
  isListening: boolean
  onTranscriptUpdate: (transcript: string) => void
}

export function TranscriptionPanel({ transcript, isListening, onTranscriptUpdate }: TranscriptionPanelProps) {
  const recognitionRef = useRef<any>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported")
      return
    }

    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.continuous = true
    recognitionRef.current.interimResults = true
    recognitionRef.current.lang = "en-US"

    let interimTranscript = ""

    recognitionRef.current.onstart = () => {
      console.log("Speech recognition started")
    }

    recognitionRef.current.onresult = (event: any) => {
      interimTranscript = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript

        if (event.results[i].isFinal) {
          onTranscriptUpdate(transcript + (transcript.endsWith(".") ? " " : ". "))
        } else {
          interimTranscript += transcript
        }
      }
    }

    recognitionRef.current.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error)
    }

    if (isListening) {
      recognitionRef.current.start()
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [isListening, onTranscriptUpdate])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [transcript])

  return (
    <Card className="p-6 bg-card border border-border flex flex-col flex-1 min-h-64">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Real-time Transcription</h3>
        <Badge variant={isListening ? "default" : "secondary"}>{isListening ? "Listening..." : "Standby"}</Badge>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 bg-background/50 rounded-md p-4 text-sm leading-relaxed text-muted-foreground overflow-y-auto"
      >
        {transcript || (
          <span className="text-muted-foreground/50">Your transcript will appear here as you speak...</span>
        )}
      </div>

      <div className="mt-4 text-xs text-muted-foreground">
        Characters: {transcript.length} | Words: {transcript.split(/\s+/).filter((w) => w).length}
      </div>
    </Card>
  )
}
