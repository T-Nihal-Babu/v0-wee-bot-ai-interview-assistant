import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function POST(request: Request) {
  try {
    const { context, questionNumber, totalQuestions } = await request.json()

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const prompt = `You are an expert interview coach. Generate a single behavioral interview question for question ${questionNumber} of ${totalQuestions}.

Context: ${context || "General software engineer"}

Requirements:
- The question should be realistic and commonly asked in tech interviews
- It should be open-ended and allow for a 2-3 minute answer
- It should assess soft skills like communication, problem-solving, teamwork, or leadership
- Return ONLY the question text, nothing else

Question:`

    const result = await model.generateContent(prompt)
    const responseText = result.response.candidates?.[0]?.content?.parts?.[0]?.text || ""

    return Response.json({
      question: responseText.trim(),
      success: true,
    })
  } catch (error) {
    console.error("Error generating question:", error)
    return Response.json(
      {
        error: "Failed to generate question",
        success: false,
      },
      { status: 500 },
    )
  }
}
