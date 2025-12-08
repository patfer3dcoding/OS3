import db from "@/app/api/utils/db";
import { randomUUID } from 'crypto';

export async function loader({ request }) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");

    let query = "SELECT * FROM jobs WHERE 1=1";
    const values = [];

    if (search) {
      query += ` AND (LOWER(title) LIKE LOWER(?) OR LOWER(department) LIKE LOWER(?) OR LOWER(location) LIKE LOWER(?))`;
      values.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (status) {
      query += ` AND status = ?`;
      values.push(status);
    }

    query += " ORDER BY created_at DESC";

    const jobs = db.prepare(query).all(...values);

    return Response.json({ success: true, jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
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
    const {
      title,
      department,
      location,
      job_type,
      salary_min,
      salary_max,
      status,
      description,
      requirements,
    } = body;

    if (!title) {
      return Response.json(
        { success: false, error: "Title is required" },
        { status: 400 },
      );
    }

    const id = randomUUID();
    // Ensure requirements is stored as a comma-separated string if it's an array
    const requirementsStr = Array.isArray(requirements) ? requirements.join(', ') : (requirements || '');

    const insert = db.prepare(`
      INSERT INTO jobs (id, title, department, location, job_type, salary_min, salary_max, status, description, requirements)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(
      id,
      title,
      department || null,
      location || null,
      job_type || "full-time",
      salary_min || null,
      salary_max || null,
      status || "open",
      description || null,
      requirementsStr
    );

    const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(id);

    return Response.json({ success: true, job });
  } catch (error) {
    console.error("Error creating job:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
