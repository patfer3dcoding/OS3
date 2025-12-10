import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const templates = await sql`
      SELECT * FROM email_templates 
      ORDER BY created_at DESC
    `;

    return Response.json({ success: true, templates });
  } catch (error) {
    console.error("Error fetching email templates:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, subject, body: emailBody, type } = body;

    if (!name || !subject || !emailBody) {
      return Response.json(
        { success: false, error: "Name, subject, and body are required" },
        { status: 400 },
      );
    }

    const result = await sql`
      INSERT INTO email_templates (name, subject, body, type)
      VALUES (${name}, ${subject}, ${emailBody}, ${type || "general"})
      RETURNING *
    `;

    return Response.json({ success: true, template: result[0] });
  } catch (error) {
    console.error("Error creating email template:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
