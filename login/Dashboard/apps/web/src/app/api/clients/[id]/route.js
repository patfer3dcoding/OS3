import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const client = await sql`SELECT * FROM clients WHERE id = ${id}`;

    if (client.length === 0) {
      return Response.json({ error: "Client not found" }, { status: 404 });
    }

    // Get additional data
    const [contacts, placements, payments, interactions] =
      await sql.transaction([
        sql`SELECT * FROM client_contacts WHERE client_id = ${id} ORDER BY is_primary DESC, created_at DESC`,
        sql`
        SELECT cp.*, c.name as candidate_name, c.email as candidate_email, j.title as job_title
        FROM client_placements cp
        LEFT JOIN candidates c ON cp.candidate_id = c.id
        LEFT JOIN jobs j ON cp.job_id = j.id
        WHERE cp.client_id = ${id}
        ORDER BY cp.created_at DESC
      `,
        sql`SELECT * FROM client_payments WHERE client_id = ${id} ORDER BY created_at DESC`,
        sql`SELECT * FROM client_interactions WHERE client_id = ${id} ORDER BY interaction_date DESC LIMIT 10`,
      ]);

    return Response.json({
      client: client[0],
      contacts,
      placements,
      payments,
      interactions,
    });
  } catch (error) {
    console.error("Error fetching client:", error);
    return Response.json({ error: "Failed to fetch client" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();

    let query = "UPDATE clients SET updated_at = CURRENT_TIMESTAMP";
    const values = [];
    let paramCount = 0;

    const fields = [
      "company_name",
      "industry",
      "website",
      "company_size",
      "contact_name",
      "contact_title",
      "contact_email",
      "contact_phone",
      "address",
      "city",
      "state",
      "country",
      "zip_code",
      "status",
      "client_type",
      "priority",
      "commission_type",
      "commission_rate",
      "commission_flat_fee",
      "payment_terms",
      "currency",
      "contract_start_date",
      "contract_end_date",
      "contract_status",
      "contract_document_url",
      "total_revenue",
      "total_placements",
      "active_jobs_count",
      "rating",
      "notes",
      "tags",
    ];

    fields.forEach((field) => {
      if (data[field] !== undefined) {
        paramCount++;
        query += `, ${field} = $${paramCount}`;
        values.push(data[field]);
      }
    });

    paramCount++;
    query += ` WHERE id = $${paramCount} RETURNING *`;
    values.push(id);

    const result = await sql(query, values);

    if (result.length === 0) {
      return Response.json({ error: "Client not found" }, { status: 404 });
    }

    return Response.json({ client: result[0] });
  } catch (error) {
    console.error("Error updating client:", error);
    return Response.json({ error: "Failed to update client" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const result = await sql`DELETE FROM clients WHERE id = ${id} RETURNING *`;

    if (result.length === 0) {
      return Response.json({ error: "Client not found" }, { status: 404 });
    }

    return Response.json({ message: "Client deleted successfully" });
  } catch (error) {
    console.error("Error deleting client:", error);
    return Response.json({ error: "Failed to delete client" }, { status: 500 });
  }
}
