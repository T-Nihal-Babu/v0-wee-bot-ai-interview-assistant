export async function generateInterviewQuestion(context = "", questionNumber = 1, totalQuestions = 3): Promise<string> {
  try {
    const response = await fetch("/api/generate-question", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        context,
        questionNumber,
        totalQuestions,
      }),
    })

    if (!response.ok) throw new Error("Failed to generate question")

    const data = await response.json()
    return data.question
  } catch (error) {
    console.error("Error generating question:", error)
    throw error
  }
}

export async function analyzeResponse(
  question: string,
  transcript: string,
): Promise<{
  score: number
  strengths: string[]
  improvements: string[]
  feedback: string
}> {
  try {
    const response = await fetch("/api/analyze-response", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
        transcript,
      }),
    })

    if (!response.ok) throw new Error("Failed to analyze response")

    const data = await response.json()
    return data.analysis
  } catch (error) {
    console.error("Error analyzing response:", error)
    throw error
  }
}

export async function analyzeCommunicationMetrics(transcript: string): Promise<{
  communicationSkills: number
  vocabulary: number
  confidence: number
  bodyLanguage: number
  clarity: number
}> {
  try {
    const response = await fetch("/api/analyze-communication", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transcript }),
    })

    if (!response.ok) throw new Error("Failed to analyze metrics")

    const data = await response.json()
    return data.metrics
  } catch (error) {
    console.error("Error analyzing communication metrics:", error)
    throw error
  }
}

export async function analyzeCode(
  code: string,
  language: string,
  problemDescription: string,
): Promise<{
  codeQuality: number
  efficiency: number
  readability: number
  suggestions: string[]
  optimizations: string[]
}> {
  try {
    const response = await fetch("/api/analyze-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        language,
        problemDescription,
      }),
    })

    if (!response.ok) throw new Error("Failed to analyze code")

    const data = await response.json()
    return data.analysis
  } catch (error) {
    console.error("Error analyzing code:", error)
    throw error
  }
}

export async function generateImprovementTips(
  category: "communication" | "coding",
  skillLevel: string,
): Promise<string[]> {
  try {
    const response = await fetch("/api/generate-tips", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        category,
        skillLevel,
      }),
    })

    if (!response.ok) throw new Error("Failed to generate tips")

    const data = await response.json()
    return data.tips
  } catch (error) {
    console.error("Error generating tips:", error)
    throw error
  }
}
