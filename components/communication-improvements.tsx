"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Youtube } from "lucide-react"
import type { CommunicationSession } from "@/lib/storage"

interface CommunicationImprovementsProps {
  session: CommunicationSession
}

export function CommunicationImprovements({ session }: CommunicationImprovementsProps) {
  // Mock analysis data - in production, this would come from Gemini API analysis
  const analysis = {
    stutteringMoments: [
      { timestamp: "0:12", issue: "Repeated hesitation on 'tell me about yourself'" },
      { timestamp: "1:45", issue: "Paused too long before answering technical question" },
      { timestamp: "3:20", issue: "Filler words ('um', 'uh') during explanation" },
    ],
    improvementAreas: [
      { area: "Grammar", confidence: 65 },
      { area: "Vocabulary", confidence: 72 },
      { area: "Clarity", confidence: 68 },
      { area: "Pace", confidence: 60 },
    ],
    resources: [
      { title: "English Grammar Basics", url: "https://www.youtube.com/watch?v=GRAMMAR001" },
      { title: "Vocabulary Building for Interviews", url: "https://www.youtube.com/watch?v=VOCAB001" },
      { title: "Confident Speaking Tips", url: "https://www.youtube.com/watch?v=SPEAK001" },
      { title: "Eliminating Filler Words", url: "https://www.youtube.com/watch?v=FILLER001" },
    ],
  }

  return (
    <div className="space-y-6">
      {/* Video Playback */}
      <Card className="p-6 bg-card border border-border">
        <h3 className="text-lg font-semibold mb-4">Your Session Video</h3>
        <div className="bg-background/50 rounded-lg aspect-video flex items-center justify-center mb-4">
          <div className="text-center">
            <Youtube className="w-12 h-12 text-accent mx-auto mb-2" />
            <p className="text-muted-foreground">Video recording available</p>
            <p className="text-sm text-muted-foreground">Recorded on {new Date(session.date).toLocaleDateString()}</p>
          </div>
        </div>
        <button className="w-full px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors">
          Play Video
        </button>
      </Card>

      {/* Overall Analysis */}
      <Card className="p-6 bg-card border border-border">
        <h3 className="text-lg font-semibold mb-4">Overall Analysis</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">Stuttering Moments Detected</p>
              <p className="text-muted-foreground text-sm">{analysis.stutteringMoments.length} instances found</p>
            </div>
          </div>
          <div>
            <p className="font-medium text-sm mb-3">Improvement Areas</p>
            <div className="space-y-2">
              {analysis.improvementAreas.map((item) => (
                <div key={item.area} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{item.area}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-background rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full" style={{ width: `${item.confidence}%` }} />
                    </div>
                    <span className="text-sm font-medium">{item.confidence}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Stuttering Timestamps */}
      <Card className="p-6 bg-card border border-border">
        <h3 className="text-lg font-semibold mb-4">Areas to Improve (with Timestamps)</h3>
        <div className="space-y-3">
          {analysis.stutteringMoments.map((moment, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-3 bg-background/50 rounded-lg hover:bg-background/70 transition-colors cursor-pointer"
            >
              <Badge variant="outline" className="mt-1 flex-shrink-0">
                {moment.timestamp}
              </Badge>
              <div className="flex-1">
                <p className="text-sm font-medium">{moment.issue}</p>
              </div>
              <button className="px-3 py-1 text-xs bg-accent/10 text-accent rounded hover:bg-accent/20 transition-colors flex-shrink-0">
                Jump to
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Learning Resources */}
      <Card className="p-6 bg-card border border-border">
        <h3 className="text-lg font-semibold mb-4">Recommended Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {analysis.resources.map((resource, idx) => (
            <a
              key={idx}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-background/50 rounded-lg hover:bg-background/70 hover:border-accent/50 border border-border transition-all flex items-center gap-3 group"
            >
              <Youtube className="w-4 h-4 text-accent flex-shrink-0 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium group-hover:text-accent transition-colors">{resource.title}</p>
            </a>
          ))}
        </div>
      </Card>
    </div>
  )
}
