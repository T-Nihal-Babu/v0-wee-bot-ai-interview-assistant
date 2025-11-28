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
