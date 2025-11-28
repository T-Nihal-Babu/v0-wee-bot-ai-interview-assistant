import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const { code, language, problemDescription } = await request.json()

    if (!code || !language) {
      return Response.json(
        {
          error: "Code and language are required",
        },
        { status: 400 },
      )
    }

    const { text } = await generateText({
      model: "gemini-2.5-flash",
      prompt: `Analyze the following ${language} code for a problem: "${problemDescription}"

Code:
\`\`\`${language}
${code}
\`\`\`

Provide:
1. Code Quality score (0-100)
2. Efficiency score (0-100)
3. Readability score (0-100)
4. List of 3-5 specific suggestions for improvement
5. List of 3-5 optimization recommendations

Respond in JSON format:
{
  "codeQuality": number,
  "efficiency": number,
  "readability": number,
  "suggestions": ["suggestion1", "suggestion2", ...],
  "optimizations": ["optimization1", "optimization2", ...]
}`,
    })

    const analysis = JSON.parse(text)

    return Response.json({
      analysis,
    })
  } catch (error) {
    console.error("Error analyzing code:", error)
    return Response.json({
      error: "Failed to analyze code",
      analysis: {
        codeQuality: 70,
        efficiency: 65,
        readability: 75,
        suggestions: ["Add comments", "Improve variable names", "Handle edge cases"],
        optimizations: ["Use more efficient algorithm", "Reduce time complexity", "Optimize memory usage"],
      },
    })
  }
}
