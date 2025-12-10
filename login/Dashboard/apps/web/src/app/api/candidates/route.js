import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");

    let query = "SELECT * FROM candidates WHERE 1=1";
    const values = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      query += ` AND (LOWER(name) LIKE LOWER($${paramCount}) OR LOWER(email) LIKE LOWER($${paramCount}) OR LOWER(position) LIKE LOWER($${paramCount}))`;
      values.push(`%${search}%`);
    }

    if (status) {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      values.push(status);
    }

    query += " ORDER BY created_at DESC";

    const candidates = await sql(query, values);

    return Response.json({ success: true, candidates });
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      position,
      status,
      experience_years,
      skills,
      location,
      salary_expectation,
      notes,
    } = body;

    if (!name || !email) {
      return Response.json(
        { success: false, error: "Name and email are required" },
        { status: 400 },
      );
    }

    const result = await sql(
      `INSERT INTO candidates (name, email, phone, position, status, experience_years, skills, location, salary_expectation, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        name,
        email,
        phone || null,
        position || null,
        status || "new",
        experience_years || null,
        skills || [],
        location || null,
        salary_expectation || null,
        notes || null,
      ],
    );

    return Response.json({ success: true, candidate: result[0] });
  } catch (error) {
    console.error("Error creating candidate:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
