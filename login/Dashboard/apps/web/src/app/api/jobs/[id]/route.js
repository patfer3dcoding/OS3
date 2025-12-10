import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const job = await sql`SELECT * FROM jobs WHERE id = ${id}`;

    if (job.length === 0) {
      return Response.json(
        { success: false, error: "Job not found" },
        { status: 404 },
      );
    }

    return Response.json({ success: true, job: job[0] });
  } catch (error) {
    console.error("Error fetching job:", error);
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
      "title",
      "department",
      "location",
      "job_type",
      "salary_min",
      "salary_max",
      "status",
      "description",
      "requirements",
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

    const query = `UPDATE jobs SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount} RETURNING *`;
    const result = await sql(query, values);

    if (result.length === 0) {
      return Response.json(
        { success: false, error: "Job not found" },
        { status: 404 },
      );
    }

    return Response.json({ success: true, job: result[0] });
  } catch (error) {
    console.error("Error updating job:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const result = await sql`DELETE FROM jobs WHERE id = ${id} RETURNING *`;

    if (result.length === 0) {
      return Response.json(
        { success: false, error: "Job not found" },
        { status: 404 },
      );
    }

    return Response.json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting job:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
