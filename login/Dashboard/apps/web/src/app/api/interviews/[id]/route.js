import sql from "@/app/api/utils/sql";

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const updates = [];
    const values = [];
    let paramCount = 0;

    const allowedFields = ["interview_date", "type", "status", "notes"];

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

    const query = `UPDATE interviews SET ${updates.join(", ")} WHERE id = $${paramCount} RETURNING *`;
    const result = await sql(query, values);

    if (result.length === 0) {
      return Response.json(
        { success: false, error: "Interview not found" },
        { status: 404 },
      );
    }

    return Response.json({ success: true, interview: result[0] });
  } catch (error) {
    console.error("Error updating interview:", error);
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
      await sql`DELETE FROM interviews WHERE id = ${id} RETURNING *`;

    if (result.length === 0) {
      return Response.json(
        { success: false, error: "Interview not found" },
        { status: 404 },
      );
    }

    return Response.json({
      success: true,
      message: "Interview deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting interview:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
