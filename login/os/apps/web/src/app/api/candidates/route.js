import db from "@/app/api/utils/db";
import { randomUUID } from 'crypto';

export async function loader({ request }) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");

    let query = "SELECT * FROM candidates WHERE 1=1";
    const values = [];

    if (search) {
      query += ` AND (LOWER(name) LIKE LOWER(?) OR LOWER(email) LIKE LOWER(?) OR LOWER(position) LIKE LOWER(?))`;
      values.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (status) {
      query += ` AND status = ?`;
      values.push(status);
    }

    query += " ORDER BY created_at DESC";

    const candidates = db.prepare(query).all(...values);

    return Response.json({ success: true, candidates });
  } catch (error) {
    console.error("Error fetching candidates:", error);
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
      name,
      email,
      phone,
      position,
      status,
      experience_years,
      skills,
      location,
      salary_expectation,
      notes,
      photo_url,
      resume_url,
      linkedin_url,
      github_url,
      portfolio_url,
      twitter_url,
    } = body;

    if (!name || !email) {
      return Response.json(
        { success: false, error: "Name and email are required" },
        { status: 400 },
      );
    }

    const id = randomUUID();
    const skillsStr = Array.isArray(skills) ? skills.join(', ') : (skills || '');

    const insert = db.prepare(`
      INSERT INTO candidates (
        id, name, email, phone, position, status, experience_years, skills, 
        location, salary_expectation, notes, photo_url, resume_url, 
        linkedin_url, github_url, portfolio_url, twitter_url
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(
      id,
      name,
      email,
      phone || null,
      position || null,
      status || "new",
      experience_years || null,
      skillsStr,
      location || null,
      salary_expectation || null,
      notes || null,
      photo_url || null,
      resume_url || null,
      linkedin_url || null,
      github_url || null,
      portfolio_url || null,
      twitter_url || null
    );

    const candidate = db.prepare('SELECT * FROM candidates WHERE id = ?').get(id);

    return Response.json({ success: true, candidate });
  } catch (error) {
    console.error("Error creating candidate:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
