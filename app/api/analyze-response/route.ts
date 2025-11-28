import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function POST(request: Request) {
  try {
    const { question, transcript } = await request.json()

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const prompt = `You are an expert interview evaluator. Analyze this interview response.

Question: ${question}

Candidate's Response: ${transcript}

Provide a structured evaluation in JSON format with these fields:
- score (0-100): Overall score
- strengths (array of 2-3 key strengths)
- improvements (array of 2-3 areas to improve)
- feedback (1-2 sentences of constructive feedback)

Return ONLY valid JSON, no additional text.`

    const result = await model.generateContent(prompt)
    const responseText = result.response.candidates?.[0]?.content?.parts?.[0]?.text || "{}"

    const analysis = JSON.parse(responseText)

    return Response.json({
      analysis,
      success: true,
    })
  } catch (error) {
    console.error("Error analyzing response:", error)
    return Response.json(
      {
        error: "Failed to analyze response",
        success: false,
      },
      { status: 500 },
    )
  }
}
