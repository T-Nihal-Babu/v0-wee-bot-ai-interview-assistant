import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const { transcript } = await request.json()

    if (!transcript) {
      return Response.json(
        {
          error: "Transcript is required",
        },
        { status: 400 },
      )
    }

    const { text } = await generateText({
      model: "gemini-2.5-flash",
      prompt: `Analyze the following interview transcript and provide metrics for:
1. Communication Skills (0-100): How well structured and articulate is the response?
2. Vocabulary (0-100): Quality and variety of words used
3. Confidence (0-100): How confident does the speaker sound?
4. Body Language (0-100): Inferred confidence and engagement from speech patterns
5. Clarity (0-100): How clear and understandable is the response?

Transcript: "${transcript}"

Respond in JSON format:
{
  "communicationSkills": number,
  "vocabulary": number,
  "confidence": number,
  "bodyLanguage": number,
  "clarity": number
}`,
    })

    const metrics = JSON.parse(text)

    return Response.json({
      metrics,
    })
  } catch (error) {
    console.error("Error analyzing communication:", error)
    return Response.json({
      error: "Failed to analyze communication",
      metrics: {
        communicationSkills: 70,
        vocabulary: 65,
        confidence: 75,
        bodyLanguage: 70,
        clarity: 72,
      },
    })
  }
}
