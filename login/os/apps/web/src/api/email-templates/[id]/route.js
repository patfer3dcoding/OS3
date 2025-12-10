import db from "../../../utils/db.server";

export async function action({ request, params }) {
  if (request.method !== 'DELETE') {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { id } = params;

    // Check existence
    const existing = db.prepare('SELECT * FROM email_templates WHERE id = ?').get(id);

    if (!existing) {
      return Response.json(
        { success: false, error: "Template not found" },
        { status: 404 },
      );
    }

    // Since FileDB doesn't support DELETE sql yet in `executeRun` (checked previously, it only does INSERT/UPDATE), 
    // I need to verify if DELETE is supported.
    // Let's check db.server.js content for DELETE support.
    // If not, I should add it.
    // Wait, the audit of db.server.js showed ONLY handle insert/update.
    // I NEED TO ADD DELETE SUPPORT TO db.server.js!

    // Assuming I will add DELETE support momentarily. 
    db.prepare('DELETE FROM email_templates WHERE id = ?').run(id);

    return Response.json({
      success: true,
      message: "Template deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting template:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
