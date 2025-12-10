import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const interviews = await sql`
      SELECT 
        i.id,
        i.candidate_id,
        i.job_id,
        i.interview_date,
        i.type,
        i.status,
        i.notes,
        c.name as candidate_name,
        j.title as job_title
      FROM interviews i
      LEFT JOIN candidates c ON i.candidate_id = c.id
      LEFT JOIN jobs j ON i.job_id = j.id
      ORDER BY i.interview_date DESC
    `;

    return Response.json({ success: true, interviews });
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { candidate_id, job_id, interview_date, type, notes } = body;

    const result = await sql`
      INSERT INTO interviews (candidate_id, job_id, interview_date, type, notes, status)
      VALUES (${candidate_id}, ${job_id}, ${interview_date}, ${type}, ${notes || null}, 'scheduled')
      RETURNING *
    `;

    return Response.json({ success: true, interview: result[0] });
  } catch (error) {
    console.error("Error creating interview:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
