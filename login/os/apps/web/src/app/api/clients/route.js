import db from "@/app/api/utils/db";

export async function loader({ request }) {
  try {
    const url = new URL(request.url);
    const searchQuery = url.searchParams.get("search")?.toLowerCase();
    const statusFilter = url.searchParams.get("status");

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
