export async function POST(request) {
  try {
    const body = await request.json();
    const { candidate, transcript } = body;

    const conversationContext = transcript
      .map((t) => `${t.speaker}: ${t.text}`)
      .join("\n");

    const prompt = `You are an expert interview coach helping an interviewer conduct a professional job interview. Based on the conversation so far, suggest 3-5 relevant follow-up questions or topics to explore.

Focus on:
- Technical skills assessment
- Cultural fit
- Problem-solving abilities
- Past experience validation
- Behavioral questions

Candidate Profile:
Name: ${candidate.name}
Position: ${candidate.position}
Experience: ${candidate.experience_years} years
Skills: ${candidate.skills?.join(", ") || "N/A"}

Current Conversation:
${conversationContext || "Interview just started"}

Provide 3-5 suggested questions to ask next. Return ONLY a JSON array of strings.
Example: ["Question 1?", "Question 2?", "Question 3?"]`;

    const response = await fetch(
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
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to get AI suggestions from Gemini");
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;

    // Extract JSON array from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    let suggestions = [
      "Can you tell me about a challenging project you've worked on?",
      "What interests you most about this role?",
      "How do you approach problem-solving?",
    ];

    if (jsonMatch) {
      try {
        suggestions = JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.error("Failed to parse suggestions JSON:", e);
      }
    }

    return Response.json({ success: true, suggestions });
  } catch (error) {
    console.error("Error getting AI suggestions:", error);
    return Response.json(
      {
        success: false,
        error: error.message,
        suggestions: [
          "Can you tell me about a challenging project you've worked on?",
          "What interests you most about this role?",
          "How do you approach problem-solving?",
        ],
      },
      { status: 500 },
    );
  }
}
