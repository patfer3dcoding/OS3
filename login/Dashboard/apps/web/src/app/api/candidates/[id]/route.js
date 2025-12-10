import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const candidate = await sql`SELECT * FROM candidates WHERE id = ${id}`;

    if (candidate.length === 0) {
      return Response.json(
        { success: false, error: "Candidate not found" },
        { status: 404 },
      );
    }

    return Response.json({ success: true, candidate: candidate[0] });
  } catch (error) {
    console.error("Error fetching candidate:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const updates = [];
    const values = [];
    let paramCount = 0;

    const allowedFields = [
      "name",
      "email",
      "phone",
      "position",
      "status",
      "experience_years",
      "skills",
      "location",
      "salary_expectation",
      "notes",
      "photo_url",
      "resume_url",
      "linkedin_url",
      "github_url",
      "portfolio_url",
      "twitter_url",
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        paramCount++;
        updates.push(`${field} = $${paramCount}`);
        values.push(body[field]);
      }
    }

    if (updates.length === 0) {
      return Response.json(
        { success: false, error: "No valid fields to update" },
        { status: 400 },
      );
    }

    paramCount++;
    values.push(id);

    const query = `UPDATE candidates SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount} RETURNING *`;
    const result = await sql(query, values);

    if (result.length === 0) {
      return Response.json(
        { success: false, error: "Candidate not found" },
        { status: 404 },
      );
    }

    return Response.json({ success: true, candidate: result[0] });
  } catch (error) {
    console.error("Error updating candidate:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const result =
      await sql`DELETE FROM candidates WHERE id = ${id} RETURNING *`;

    if (result.length === 0) {
      return Response.json(
        { success: false, error: "Candidate not found" },
        { status: 404 },
      );
    }

    return Response.json({
      success: true,
      message: "Candidate deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting candidate:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
