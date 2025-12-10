import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");

    let query = "SELECT * FROM jobs WHERE 1=1";
    const values = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      query += ` AND (LOWER(title) LIKE LOWER($${paramCount}) OR LOWER(department) LIKE LOWER($${paramCount}) OR LOWER(location) LIKE LOWER($${paramCount}))`;
      values.push(`%${search}%`);
    }

    if (status) {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      values.push(status);
    }

    query += " ORDER BY created_at DESC";

    const jobs = await sql(query, values);

    return Response.json({ success: true, jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
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
      title,
      department,
      location,
      job_type,
      salary_min,
      salary_max,
      status,
      description,
      requirements,
    } = body;

    if (!title) {
      return Response.json(
        { success: false, error: "Title is required" },
        { status: 400 },
      );
    }

    const result = await sql(
      `INSERT INTO jobs (title, department, location, job_type, salary_min, salary_max, status, description, requirements)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        title,
        department || null,
        location || null,
        job_type || "full-time",
        salary_min || null,
        salary_max || null,
        status || "open",
        description || null,
        requirements || [],
      ],
    );

    return Response.json({ success: true, job: result[0] });
  } catch (error) {
    console.error("Error creating job:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
