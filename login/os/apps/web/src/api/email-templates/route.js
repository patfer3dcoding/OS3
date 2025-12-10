import db from "../../utils/db.server";
import { demoEmails } from "../../../utils/demoData";
import { randomUUID } from 'crypto';

export async function loader({ request }) {
  try {
    // Check for empty database and seed if needed
    const count = db.prepare('SELECT COUNT(*) as count FROM email_templates').get().count;
    // Note: older db implementation might have needed 'get()[0]?.count', checking db.server.js 'executeGet' returns object or undefined. 
    // It returns {count: N} for count(*).

    if (count === 0) {
      console.log('Seeding demo email templates...');

      const insert = db.prepare('INSERT INTO email_templates (id, name, subject, body, type)');

      const insertMany = db.transaction((templates) => {
        for (const t of templates) {
          insert.run({
            id: t.id,
            name: t.name,
            subject: t.subject,
            body: t.body,
            type: t.category || 'general'
          });
        }
      });

      insertMany(demoEmails);
    }

    const templates = db.prepare('SELECT * FROM email_templates ORDER BY created_at DESC').all();

    return Response.json({ success: true, templates });
  } catch (error) {
    console.error("Error fetching email templates:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function action({ request }) {
  const method = request.method;

  if (method === 'POST') {
    try {
      const body = await request.json();
      const { name, subject, body: emailBody, type } = body;

      if (!name || !subject || !emailBody) {
        return Response.json(
          { success: false, error: "Name, subject, and body are required" },
          { status: 400 },
        );
      }

      const id = randomUUID();
      const insert = db.prepare(`
            INSERT INTO email_templates (id, name, subject, body, type)
            VALUES (?, ?, ?, ?, ?)
        `);

      insert.run(id, name, subject, emailBody, type || "general");

      const template = db.prepare('SELECT * FROM email_templates WHERE id = ?').get(id);

      return Response.json({ success: true, template });
    } catch (error) {
      console.error("Error creating email template:", error);
      return Response.json(
        { success: false, error: error.message },
        { status: 500 },
      );
    }
  }

  return new Response("Method not allowed", { status: 405 });
}

