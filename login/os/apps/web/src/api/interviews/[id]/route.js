import db from "@/api/utils/db.server";

export async function action({ request, params }) {
  const { id } = params;

  if (request.method === 'DELETE') {
    try {
      const result = db.prepare('DELETE FROM interviews WHERE id = ?').run(id);

      if (result.changes === 0) {
        return Response.json(
          { success: false, error: "Interview not found" },
          { status: 404 },
        );
      }

      return Response.json({ success: true, message: "Interview deleted successfully" });
    } catch (error) {
      console.error("Error deleting interview:", error);
      return Response.json(
        { success: false, error: error.message },
        { status: 500 },
      );
    }
  }

  if (request.method === 'PUT') {
    try {
      const body = await request.json();
      const { status } = body;

      const result = db.prepare('UPDATE interviews SET status = ? WHERE id = ?').run(status, id);

      if (result.changes === 0) {
        return Response.json(
          { success: false, error: "Interview not found" },
          { status: 404 },
        );
      }

      const interview = db.prepare('SELECT * FROM interviews WHERE id = ?').get(id);
      return Response.json({ success: true, interview });

    } catch (error) {
      console.error("Error updating interview:", error);
      return Response.json(
        { success: false, error: error.message },
        { status: 500 },
      );
    }
  }

  return new Response("Method not allowed", { status: 405 });
}
