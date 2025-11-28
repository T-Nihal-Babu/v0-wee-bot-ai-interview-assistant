"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface CodeEditorProps {
  code: string
  onCodeChange: (code: string) => void
  language: string
}

export function CodeEditor({ code, onCodeChange, language }: CodeEditorProps) {
  const [lineNumbers, setLineNumbers] = useState<number[]>([])

  useEffect(() => {
    const lines = code.split("\n").length
    setLineNumbers(Array.from({ length: lines }, (_, i) => i + 1))
  }, [code])

  return (
    <Card className="p-0 bg-card border border-border overflow-hidden flex flex-col flex-1">
      <div className="flex items-center justify-between px-4 py-3 bg-background/50 border-b border-border">
        <Badge variant="outline">{language}</Badge>
        <span className="text-xs text-muted-foreground">{code.split("\n").length} lines</span>
      </div>

      <div className="flex flex-1 overflow-hidden font-mono">
        {/* Line Numbers */}
        <div className="bg-background/50 border-r border-border px-3 py-4 text-right text-muted-foreground select-none min-w-fit">
          {lineNumbers.map((num) => (
            <div key={num} className="text-xs leading-6">
              {num}
            </div>
          ))}
        </div>

        {/* Editor */}
        <textarea
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          className="flex-1 bg-transparent text-foreground p-4 font-mono text-sm resize-none focus:outline-none"
          placeholder="// Write your code here"
          spellCheck="false"
        />
      </div>
    </Card>
  )
}
