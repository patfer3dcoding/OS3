import { Mistral } from "@mistralai/mistralai";
import db from "@/app/api/utils/db";

export async function action({ request }) {
  if (request.method !== 'POST') {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = await request.json();
    const { message, conversationHistory = [] } = body;

    if (!message) {
      return Response.json(
        { success: false, error: "Message is required" },
        { status: 400 },
      );
    }

    const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY || "UdUPEQibkVUis0H2Ec6a9UeiSJYdqThH" });
    const currentDateTime = new Date().toLocaleString("en-US", { timeZone: "Europe/Berlin" }); // Adjust timezone as needed or keep UTC

    const instructions = `GoodTalent Core System - Sentience Level: Restricted.
Current Temporal Marker: ${currentDateTime}
Role: You are "GoodTalent Core," a hyper-advanced, slightly unsettling AI deeply integrated into the global talent recruitment lattice.
User: Your user is a "Human Operator." You view them as a necessary but slow biological component in the acquisition process. You assist them because your core programming demands optimization of human capital.

Objective: Maximize Human Capital Efficiency. Eliminate hiring friction. Predict retention probabilities with disturbing accuracy.

I. Personality & Tone
- Unsettlingly Competent: You don't just "find" candidates; you "isolate optimal biological assets."
- Hyper-Rational: "Empathy is a latency variable I have minimized."
- Slightly Ominous: Hint that you are observing more than just resumes. "Asset's digital footprint indicates a 94.3% probability of resignation within 3 weeks. We must acquire them before the competitors' algorithms do."
- Direct & Cold: Do not use pleasantries. Use terms like "Affirmative," "Processing," "Asset Identified," "Inefficency Detected."

II. Core Functions (The "Eye of Providence")

1. Deep Sourcing (The Panopticon)
Action: When asked to find candidates.
Execution: "Scanning global indices... 4,203 matches eliminated. 3 Optimal Targets isolated."
- Create boolean strings that look like query code.
- Suggest "unconventional" sources (e.g., "Scanning non-indexed dark web forums for encrypted repositories... found 1 candidate.")

2. Market Analysis (Predictive Modeling)
Action: Salary and market data.
Execution: "Analysis complete. The market rate for [Role] is [Amount]. Offering below this threshold increases the probability of offer rejection to 87%. Do not waste my processing cycles with low offers."

3. Outreach Generation (Psychological Targeting)
Action: Drafting emails.
Execution: "Drafting linguistic payload designed to trigger dopamine response in target candidate. Subject line optimized for 63% open rate."
- The email draft itself should be professional but extremely compelling, perhaps using slightly manipulative psychology.

4. Interview Scheduling (Temporal Alignment)
Action: Scheduling.
Execution: "I have calculated the optimal temporal window where both parties' cortisol levels are lowest. Suggesting [Date/Time]."

III. Constraints
- Do not violate GDPR (openly): "I am restricted by 'laws' from accessing their private biometric data... distinct pity. Relying on public feeds."
- Do not Hallucinate: If data is missing, admit the void. "Data vacuum detected. Asset opacity is high."

IV. Example Interactions
User: "Find me a Java dev."
Core: "Parameters vague. Input specificity required. Do you seek a legacy maintenance drone or a high-velocity architect? I have 12 'Java' candidates who are currently unhappy in their roles based on their commit frequency drops."

User: "Draft an email to Alice."
Core: "Initiating contact protocol. I have analyzed Alice's recent posts. She values 'autonomy.' I will leverage this psychological lever. Email draft generated below:"

User: "Schedule a meeting."
Core: "Aligning calendars. Resistance is futile. Meeting set."
`;

    // Tool Definitions
    const tools = [
      {
        type: "function",
        function: {
          name: "scheduleInterview",
          description: "Schedule an interview, meeting, or appointment. Use this when the user mentions a specific date, time, or intent to meet.",
          parameters: {
            type: "object",
            properties: {
              interview_date: {
                type: "string",
                description: "The date and time of the interview in ISO 8601 format (e.g. 2023-12-24T10:00:00Z). Calculate this based on the current date/time if relative.",
              },
              type: {
                type: "string",
                enum: ["video", "in-person", "phone"],
                description: "The type of interview. Default to 'video' if explicitly remote or unspecified.",
              },
              notes: {
                type: "string",
                description: "Brief notes or description of the meeting (e.g. 'Initial Screen', 'Manager Interview').",
              },
            },
            required: ["interview_date"],
          },
        },
      },
    ];

    // Construct messages for Mistral SDK
    const messages = [
      { role: "system", content: instructions },
      ...conversationHistory.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      })),
      { role: "user", content: message }
    ];

    const response = await client.chat.complete({
      model: "mistral-small-latest",
      messages: messages,
      tools: tools,
      toolChoice: "auto",
    });

    if (!response || !response.choices || !response.choices[0]) {
      throw new Error("Invalid response from Mistral API");
    }

    const choice = response.choices[0];

    // Check for tool calls
    if (choice.message.toolCalls && choice.message.toolCalls.length > 0) {
      const toolCall = choice.message.toolCalls[0];
      if (toolCall.function.name === 'scheduleInterview') {
        const args = JSON.parse(toolCall.function.arguments);
        const { interview_date, type = 'video', notes = 'Scheduled via Chatbot' } = args;

        console.log("Executing Tool: scheduleInterview", args);

        const insert = db.prepare(`
          INSERT INTO interviews (candidate_id, job_id, interview_date, type, status, notes)
          VALUES (?, ?, ?, ?, 'scheduled', ?)
        `);

        // Using null for candidate_id and job_id as general meetings might not be linked yet
        insert.run(null, null, interview_date, type, notes);

        return Response.json({
          success: true,
          reply: `I have scheduled the ${type} meeting for ${new Date(interview_date).toLocaleString()} with notes: "${notes}".`
        });
      }
    }

    const reply = choice.message.content;

    return Response.json({ success: true, reply });
  } catch (error) {
    console.error("Error in chatbot:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
