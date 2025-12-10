import db from "../../utils/db.server";

import { demoInterviews } from "../../../utils/demoData";

export async function loader({ request }) {
  try {
    // Check for empty database and seed if needed
    const count = db.prepare('SELECT COUNT(*) as count FROM interviews').get().count;
    if (count === 0) {
      console.log('Seeding demo interviews...');

      const insert = db.prepare('INSERT INTO interviews');

      const insertMany = db.transaction((interviews) => {
        for (const interview of interviews) {
          insert.run({
            ...interview,
            interview_date: interview.date
          });
        }
      });

      insertMany(demoInterviews);
    }

    const interviews = db.prepare(`
      SELECT 
        i.id,
        i.candidate_id,
        i.job_id,
        i.interview_date,
        i.type,
        i.status,
        i.notes,
        c.name as candidate_name,
        j.title as job_title
      FROM interviews i
      LEFT JOIN candidates c ON i.candidate_id = c.id
      LEFT JOIN jobs j ON i.job_id = j.id
      ORDER BY i.interview_date DESC
    `).all();

    return Response.json({ success: true, interviews });
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function action({ request }) {
  if (request.method !== 'POST') {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = await request.json();
    const { candidate_id, job_id, interview_date, type, notes } = body;

    const insert = db.prepare(`
      INSERT INTO interviews (candidate_id, job_id, interview_date, type, notes, status)
      VALUES (?, ?, ?, ?, ?, 'scheduled')
    `);

    const info = insert.run(
      candidate_id,
      job_id,
      interview_date,
      type,
      notes || null
    );

    const interview = db.prepare('SELECT * FROM interviews WHERE id = ?').get(info.lastInsertRowid);

    return Response.json({ success: true, interview });
  } catch (error) {
    console.error("Error creating interview:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
