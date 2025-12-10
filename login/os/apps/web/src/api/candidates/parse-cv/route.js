export async function POST(request) {
  try {
    const body = await request.json();
    const { cvText } = body;

    if (!cvText) {
      return Response.json(
        { success: false, error: "CV text is required" },
        { status: 400 },
      );
    }

    const prompt = `You are a CV/resume parser. Extract structured information from the provided CV text and return ONLY valid JSON.

Parse this CV and extract the following information in this exact JSON format:
{
  "name": "string or null",
  "email": "string or null",
  "phone": "string or null",
  "position": "string or null (current or desired job title)",
  "location": "string or null",
  "experience_years": number or null,
  "skills": ["skill1", "skill2"],
  "salary_expectation": number or null,
  "linkedin_url": "string or null",
  "github_url": "string or null",
  "portfolio_url": "string or null",
  "twitter_url": "string or null",
  "notes": "string or null (summary or additional notes)"
}

CV Text:
${cvText}`;

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
            temperature: 0.2,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to parse CV with Gemini");
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to extract JSON from AI response");
    }

    const parsedData = JSON.parse(jsonMatch[0]);

    return Response.json({ success: true, data: parsedData });
  } catch (error) {
    console.error("Error parsing CV:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
