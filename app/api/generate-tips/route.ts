import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const { category, skillLevel } = await request.json()

    if (!category) {
      return Response.json(
        {
          error: "Category is required",
        },
        { status: 400 },
      )
    }

    const prompt =
      category === "communication"
        ? `Generate 5 specific, actionable tips for improving interview communication skills at ${skillLevel} level. Focus on practical advice that can be immediately applied.`
        : `Generate 5 specific, actionable tips for improving coding problem-solving skills at ${skillLevel} level. Focus on algorithm optimization, code quality, and efficiency.`

    const { text } = await generateText({
      model: "gemini-2.5-flash",
      prompt: `${prompt}

Return as a JSON array of strings.`,
    })

    const tips = JSON.parse(text)

    return Response.json({
      tips: Array.isArray(tips) ? tips : Object.values(tips),
    })
  } catch (error) {
    console.error("Error generating tips:", error)
    return Response.json({
      error: "Failed to generate tips",
      tips: [
        "Practice active listening and engage with the interviewer",
        "Use the STAR method for behavioral questions",
        "Maintain eye contact and confident posture",
        "Ask clarifying questions when needed",
        "Provide specific examples from your experience",
      ],
    })
  }
}
