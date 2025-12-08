export async function POST(request) {
  try {
    const body = await request.json();
    const { candidate, response, context } = body;

    const conversationContext = context
      .slice(-5)
      .map((t) => `${t.speaker}: ${t.text}`)
      .join("\n");

    const prompt = `You are an expert interview analyst specializing in candidate assessment. Analyze the candidate's response thoroughly.

Assess the following:
1. CREDIBILITY (0-100): Assess honesty, consistency, and authenticity
2. ANSWER QUALITY (strong/moderate/weak): Evaluate completeness, relevance, and depth
3. RED FLAGS: Identify concerning patterns like vague answers, inconsistencies, overconfidence, lack of examples, or negativity
4. INSIGHTS: Provide actionable observations
5. RECOMMENDATIONS: Suggest follow-up actions

Candidate Profile:
Name: ${candidate.name}
Position: ${candidate.position}
Experience: ${candidate.experience_years} years
Skills: ${candidate.skills?.join(", ") || "N/A"}

Recent Conversation:
${conversationContext}

Latest Candidate Response:
"${response}"

Return ONLY valid JSON in this exact format:
{
  "credibilityScore": number (0-100),
  "answerQuality": "strong" | "moderate" | "weak",
  "redFlags": ["flag1", "flag2"] or [],
  "insights": "detailed analysis text",
  "recommendations": ["rec1", "rec2"]
}`;

    const aiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      },
    );

    if (!aiResponse.ok) {
      throw new Error("Failed to analyze candidate with Gemini");
    }

    const data = await aiResponse.json();
    const text = data.candidates[0].content.parts[0].text;

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    let analysis = {
      credibilityScore: 50,
      answerQuality: "moderate",
      redFlags: [],
      insights: "Unable to analyze at this time.",
      recommendations: [],
    };

    if (jsonMatch) {
      try {
        analysis = JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.error("Failed to parse analysis JSON:", e);
      }
    }

    return Response.json({ success: true, analysis });
  } catch (error) {
    console.error("Error analyzing candidate:", error);
    return Response.json(
      {
        success: false,
        error: error.message,
        analysis: {
          credibilityScore: 50,
          answerQuality: "moderate",
          redFlags: [],
          insights: "Unable to analyze at this time.",
          recommendations: [],
        },
      },
      { status: 500 },
    );
  }
}
