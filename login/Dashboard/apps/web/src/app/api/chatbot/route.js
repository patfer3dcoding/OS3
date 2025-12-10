import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const body = await request.json();
    const { message, conversationHistory = [], image } = body;

    if (!message && !image) {
      return Response.json(
        { success: false, error: "Message or image is required" },
        { status: 400 },
      );
    }

    // Get system stats for context
    const [candidatesCount, jobsCount, interviewsCount] = await sql.transaction(
      [
        sql`SELECT COUNT(*) as count FROM candidates`,
        sql`SELECT COUNT(*) as count FROM jobs`,
        sql`SELECT COUNT(*) as count FROM interviews`,
      ],
    );

    const recentCandidates = await sql`
      SELECT name, position, status, created_at 
      FROM candidates 
      ORDER BY created_at DESC 
      LIMIT 5
    `;

    const recentJobs = await sql`
      SELECT title, department, status, created_at 
      FROM jobs 
      ORDER BY created_at DESC 
      LIMIT 5
    `;

    const upcomingInterviews = await sql`
      SELECT i.interview_date, i.type, c.name as candidate_name, j.title as job_title
      FROM interviews i
      JOIN candidates c ON i.candidate_id = c.id
      JOIN jobs j ON i.job_id = j.id
      WHERE i.interview_date > NOW()
      ORDER BY i.interview_date ASC
      LIMIT 5
    `;

    // Build context for AI
    const systemContext = `You are a helpful recruiting assistant for a modern ATS (Applicant Tracking System). You help users manage candidates, jobs, interviews, and understand the system features.

CURRENT SYSTEM DATA:
- Total Candidates: ${candidatesCount[0].count}
- Total Jobs: ${jobsCount[0].count}
- Total Interviews: ${interviewsCount[0].count}

${recentCandidates.length > 0 ? `Recent Candidates:\n${recentCandidates.map((c) => `- ${c.name} (${c.position}) - Status: ${c.status}`).join("\n")}` : "No candidates yet."}

${recentJobs.length > 0 ? `Recent Jobs:\n${recentJobs.map((j) => `- ${j.title} (${j.department || "N/A"}) - ${j.status}`).join("\n")}` : "No jobs posted yet."}

${upcomingInterviews.length > 0 ? `Upcoming Interviews:\n${upcomingInterviews.map((i) => `- ${i.candidate_name} for ${i.job_title} on ${new Date(i.interview_date).toLocaleDateString()} (${i.type})`).join("\n")}` : "No upcoming interviews."}

SYSTEM FEATURES:
1. Candidates Window - Add, view, edit, search candidates. Supports CV upload with AI parsing, bulk CSV import.
2. Jobs Window - Create and manage job postings with details like salary, requirements, status.
3. Interviews Window - Schedule interviews, link to candidates and jobs, track status.
4. Analytics Window - View KPIs, charts, recruitment metrics, pipeline health.
5. Email Window - Create reusable email templates for candidate communication.
6. Browser Window - Built-in web browser for research.
7. Pipeline Window - Visual kanban-style hiring pipeline.
8. Reports Window - Generate recruitment reports and insights.
9. Settings Window - Configure system preferences.

Be friendly, professional, and helpful. Use emojis occasionally. Format responses nicely with bullet points when listing things. Keep responses concise but informative.

If an image is provided, analyze it in the context of recruiting (could be a CV screenshot, candidate profile, organizational chart, etc.) and provide helpful insights.`;

    // Build messages for Gemini
    const messages = [
      {
        role: "user",
        content: systemContext,
      },
      ...conversationHistory.map((msg) => {
        if (msg.image) {
          return {
            role: msg.role,
            content: [
              { type: "text", text: msg.content },
              { type: "image_url", image_url: { url: msg.image } },
            ],
          };
        }
        return msg;
      }),
    ];

    // Add current message
    if (image) {
      messages.push({
        role: "user",
        content: [
          { type: "text", text: message },
          { type: "image_url", image_url: { url: image } },
        ],
      });
    } else {
      messages.push({
        role: "user",
        content: message,
      });
    }

    // Call Google Gemini API
    const response = await fetch("/integrations/google-gemini/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: messages,
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error("Invalid response from Gemini API");
    }

    const reply = data.choices[0].message.content;

    return Response.json({ success: true, reply });
  } catch (error) {
    console.error("Error in chatbot:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
