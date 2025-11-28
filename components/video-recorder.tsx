"use client"

import { forwardRef, useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mic, MicOff } from "lucide-react"

export const VideoRecorder = forwardRef<HTMLDivElement>((props, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true,
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream

          // Set up recording
          const mediaRecorder = new MediaRecorder(stream)
          mediaRecorderRef.current = mediaRecorder

          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              const videoBlob = new Blob([event.data], { type: "video/webm" })
              console.log("Video recorded:", videoBlob.size, "bytes")
            }
          }

          mediaRecorder.start()
          setIsRecording(true)
        }
      } catch (error) {
        console.error("Error accessing camera:", error)
      }
    }

    startCamera()

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [])

  const toggleMute = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getAudioTracks()
      tracks.forEach((track) => {
        track.enabled = !track.enabled
      })
      setIsMuted(!isMuted)
    }
  }

  return (
    <div ref={ref} className="space-y-4">
      <Card className="bg-black border border-border overflow-hidden relative">
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-96 object-cover" />
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-red-500/90 rounded-full">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-white">RECORDING</span>
          </div>
        </div>
      </Card>

      <Button onClick={toggleMute} variant={isMuted ? "destructive" : "secondary"} className="w-full">
        {isMuted ? (
          <>
            <MicOff className="w-4 h-4 mr-2" />
            Mic Muted
          </>
        ) : (
          <>
            <Mic className="w-4 h-4 mr-2" />
            Mic Active
          </>
        )}
      </Button>
    </div>
  )
})

VideoRecorder.displayName = "VideoRecorder"
