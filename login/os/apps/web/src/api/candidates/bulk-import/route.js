export async function POST(request) {
  try {
    const body = await request.json();
    const { csvText } = body;

    if (!csvText) {
      return Response.json(
        { success: false, error: "CSV text is required" },
        { status: 400 },
      );
    }

    // Use ChatGPT to parse the CSV and extract candidate data
    const response = await fetch(
      `${process.env.APP_URL}/integrations/chat-gpt/conversationgpt4`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You are a CSV parser for candidate data. Extract and structure candidate information from CSV text. Handle various CSV formats flexibly.",
            },
            {
              role: "user",
              content: `Parse this CSV data and extract candidate information:\n\n${csvText}`,
            },
          ],
          json_schema: {
            name: "csv_parser",
            schema: {
              type: "object",
              properties: {
                candidates: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: ["string", "null"] },
                      email: { type: ["string", "null"] },
                      phone: { type: ["string", "null"] },
                      position: { type: ["string", "null"] },
                      location: { type: ["string", "null"] },
                      experience_years: { type: ["number", "null"] },
                      skills: {
                        type: "array",
                        items: { type: "string" },
                      },
                      salary_expectation: { type: ["number", "null"] },
                      linkedin_url: { type: ["string", "null"] },
                      github_url: { type: ["string", "null"] },
                      portfolio_url: { type: ["string", "null"] },
                      twitter_url: { type: ["string", "null"] },
                      notes: { type: ["string", "null"] },
                    },
                    required: [
                      "name",
                      "email",
                      "phone",
                      "position",
                      "location",
                      "experience_years",
                      "skills",
                      "salary_expectation",
                      "linkedin_url",
                      "github_url",
                      "portfolio_url",
                      "twitter_url",
                      "notes",
                    ],
                    additionalProperties: false,
                  },
                },
              },
              required: ["candidates"],
              additionalProperties: false,
            },
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to parse CSV with AI");
    }

    const data = await response.json();
    const parsedData = JSON.parse(data.choices[0].message.content);

    return Response.json({ success: true, data: parsedData.candidates });
  } catch (error) {
    console.error("Error parsing CSV:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
