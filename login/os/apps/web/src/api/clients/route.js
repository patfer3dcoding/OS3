import db from "../../utils/db.server";

import { demoClients } from "../../../utils/demoData";

export async function loader({ request }) {
  try {
    const url = new URL(request.url);
    const searchQuery = url.searchParams.get("search")?.toLowerCase();
    const statusFilter = url.searchParams.get("status");

    // Check for empty database and seed if needed
    const count = db.prepare('SELECT COUNT(*) as count FROM clients').get().count;
    if (count === 0) {
      console.log('Seeding demo clients...');

      const insert = db.prepare('INSERT INTO clients');

      const insertMany = db.transaction((clients) => {
        for (const client of clients) {
          // Mapping demoClients structure to matched DB schema (company -> company_name, project_count -> active_projects)
          insert.run({
            ...client,
            company_name: client.company,
            industry: 'Technology',
            active_projects: client.project_count
          });
        }
      });

      insertMany(demoClients);
    }

    let query = 'SELECT * FROM clients WHERE 1=1';
    const params = [];

    if (searchQuery) {
      query += ' AND (lower(company_name) LIKE ? OR lower(industry) LIKE ?)';
      params.push(`%${searchQuery}%`, `%${searchQuery}%`);
    }

    if (statusFilter) {
      query += ' AND status = ?';
      params.push(statusFilter);
    }

    query += ' ORDER BY created_at DESC';

    const clients = db.prepare(query).all(...params);

    return Response.json({ success: true, clients });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
