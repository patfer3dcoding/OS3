import db from "../../../utils/db.server";

export async function loader({ request, params }) {
  try {
    const { id } = params;
    const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(id);

    if (!job) {
      return Response.json(
        { success: false, error: "Job not found" },
        { status: 404 },
      );
    }

    return Response.json({ success: true, job });
  } catch (error) {
    console.error("Error fetching job:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function action({ request, params }) {
  const { id } = params;

  if (request.method === 'PUT') {
    try {
      const body = await request.json();

      const updates = [];
      const values = [];

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
          let value = body[field];
          // Handle array fields if any
          if (field === 'requirements' && Array.isArray(value)) {
            value = value.join(', ');
          }
          updates.push(`${field} = ?`);
          values.push(value);
        }
      }

      if (updates.length === 0) {
        return Response.json(
          { success: false, error: "No valid fields to update" },
          { status: 400 },
        );
      }

      values.push(id);

      const query = `UPDATE jobs SET ${updates.join(", ")}, created_at = created_at WHERE id = ?`;
      const result = db.prepare(query).run(...values);

      if (result.changes === 0) {
        return Response.json(
          { success: false, error: "Job not found" },
          { status: 404 },
        );
      }

      const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(id);

      return Response.json({ success: true, job });
    } catch (error) {
      console.error("Error updating job:", error);
      return Response.json(
        { success: false, error: error.message },
        { status: 500 },
      );
    }
  }

  if (request.method === 'DELETE') {
    try {
      const result = db.prepare('DELETE FROM jobs WHERE id = ?').run(id);

      if (result.changes === 0) {
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

  return new Response("Method not allowed", { status: 405 });
}
