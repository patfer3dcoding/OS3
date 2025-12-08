import db from "@/app/api/utils/db";

export async function loader({ request, params }) {
  try {
    const { id } = params;
    const candidate = db.prepare('SELECT * FROM candidates WHERE id = ?').get(id);

    if (!candidate) {
      return Response.json(
        { success: false, error: "Candidate not found" },
        { status: 404 },
      );
    }

    return Response.json({ success: true, candidate });
  } catch (error) {
    console.error("Error fetching candidate:", error);
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
          let value = body[field];
          if (field === 'skills' && Array.isArray(value)) {
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

      const query = `UPDATE candidates SET ${updates.join(", ")}, created_at = created_at WHERE id = ?`;
      const result = db.prepare(query).run(...values);

      if (result.changes === 0) {
        return Response.json(
          { success: false, error: "Candidate not found" },
          { status: 404 },
        );
      }

      const candidate = db.prepare('SELECT * FROM candidates WHERE id = ?').get(id);

      return Response.json({ success: true, candidate });
    } catch (error) {
      console.error("Error updating candidate:", error);
      return Response.json(
        { success: false, error: error.message },
        { status: 500 },
      );
    }
  }

  if (request.method === 'DELETE') {
    try {
      const result = db.prepare('DELETE FROM candidates WHERE id = ?').run(id);

      if (result.changes === 0) {
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

  return new Response("Method not allowed", { status: 405 });
}
