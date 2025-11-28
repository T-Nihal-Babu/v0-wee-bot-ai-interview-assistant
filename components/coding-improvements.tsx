"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code2, ExternalLink } from "lucide-react"
import type { CodingSession } from "@/lib/storage"

interface CodingImprovementsProps {
  session: CodingSession
}

export function CodingImprovements({ session }: CodingImprovementsProps) {
  // Mock code analysis data - in production, this would come from Gemini API
  const codeAnalysis = {
    efficiency: 72,
    readability: 80,
    bestPractices: 65,
    issues: [
      { type: "Performance", issue: "Loop can be optimized using a hash map", severity: "medium" },
      { type: "Readability", issue: "Variable names could be more descriptive", severity: "low" },
      { type: "Best Practice", issue: "Consider adding error handling for edge cases", severity: "medium" },
    ],
    suggestions: [
      { title: "Use more efficient algorithms", priority: "High" },
      { title: "Add meaningful comments for complex logic", priority: "Medium" },
      { title: "Follow naming conventions consistently", priority: "Medium" },
    ],
    resources: [
      {
        title: "LeetCode",
        url: "https://leetcode.com",
        description: "Practice coding problems with difficulty levels",
      },
      {
        title: "HackerRank",
        url: "https://www.hackerrank.com",
        description: "Algorithm and data structure challenges",
      },
      {
        title: "CodeSignal",
        url: "https://codesignal.com",
        description: "Interactive coding assessment platform",
      },
      {
        title: "GeeksforGeeks",
        url: "https://www.geeksforgeeks.org",
        description: "In-depth algorithm and coding tutorials",
      },
      {
        title: "CodeWars",
        url: "https://www.codewars.com",
        description: "Gamified coding practice with community challenges",
      },
    ],
  }

  return (
    <div className="space-y-6">
      {/* Code Quality Overview */}
      <Card className="p-6 bg-card border border-border">
        <h3 className="text-lg font-semibold mb-4">Code Quality Analysis</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-background/50 rounded-lg">
            <p className="text-2xl font-bold text-accent">{codeAnalysis.efficiency}%</p>
            <p className="text-sm text-muted-foreground">Efficiency</p>
          </div>
          <div className="text-center p-4 bg-background/50 rounded-lg">
            <p className="text-2xl font-bold text-accent">{codeAnalysis.readability}%</p>
            <p className="text-sm text-muted-foreground">Readability</p>
          </div>
          <div className="text-center p-4 bg-background/50 rounded-lg">
            <p className="text-2xl font-bold text-accent">{codeAnalysis.bestPractices}%</p>
            <p className="text-sm text-muted-foreground">Best Practices</p>
          </div>
        </div>
      </Card>

      {/* Issues Found */}
      <Card className="p-6 bg-card border border-border">
        <h3 className="text-lg font-semibold mb-4">Issues Found</h3>
        <div className="space-y-3">
          {codeAnalysis.issues.map((issue, idx) => (
            <div key={idx} className="p-3 bg-background/50 rounded-lg border-l-4 border-yellow-500">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium">{issue.issue}</p>
                  <p className="text-xs text-muted-foreground mt-1">{issue.type}</p>
                </div>
                <Badge
                  variant="outline"
                  className={
                    issue.severity === "high"
                      ? "bg-red-500/10 text-red-600 border-red-200"
                      : issue.severity === "medium"
                        ? "bg-yellow-500/10 text-yellow-600 border-yellow-200"
                        : "bg-blue-500/10 text-blue-600 border-blue-200"
                  }
                >
                  {issue.severity}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Optimization Suggestions */}
      <Card className="p-6 bg-card border border-border">
        <h3 className="text-lg font-semibold mb-4">Optimization Suggestions</h3>
        <div className="space-y-3">
          {codeAnalysis.suggestions.map((suggestion, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
              <Code2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">{suggestion.title}</p>
                <Badge variant="outline" className="mt-2 text-xs">
                  {suggestion.priority} Priority
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Learning Resources */}
      <Card className="p-6 bg-card border border-border">
        <h3 className="text-lg font-semibold mb-4">Recommended Platforms to Improve</h3>
        <div className="space-y-3">
          {codeAnalysis.resources.map((resource, idx) => (
            <a
              key={idx}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-background/50 rounded-lg hover:bg-background/70 border border-border hover:border-accent/50 transition-all flex items-start justify-between group"
            >
              <div className="flex-1">
                <p className="font-medium group-hover:text-accent transition-colors">{resource.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-accent flex-shrink-0 group-hover:scale-110 transition-transform mt-1" />
            </a>
          ))}
        </div>
      </Card>
    </div>
  )
}
