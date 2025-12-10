import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");

    let query = "SELECT * FROM clients WHERE 1=1";
    const values = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      query += ` AND (LOWER(company_name) LIKE LOWER($${paramCount}) OR LOWER(industry) LIKE LOWER($${paramCount}) OR LOWER(contact_name) LIKE LOWER($${paramCount}))`;
      values.push(`%${search}%`);
    }

    if (status) {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      values.push(status);
    }

    if (priority) {
      paramCount++;
      query += ` AND priority = $${paramCount}`;
      values.push(priority);
    }

    query += " ORDER BY created_at DESC";

    const clients = await sql(query, values);

    return Response.json({ clients });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return Response.json({ error: "Failed to fetch clients" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    const result = await sql`
      INSERT INTO clients (
        company_name, industry, website, company_size,
        contact_name, contact_title, contact_email, contact_phone,
        address, city, state, country, zip_code,
        status, client_type, priority,
        commission_type, commission_rate, commission_flat_fee, payment_terms, currency,
        contract_start_date, contract_end_date, contract_status,
        rating, notes, tags
      ) VALUES (
        ${data.company_name}, ${data.industry}, ${data.website}, ${data.company_size},
        ${data.contact_name}, ${data.contact_title}, ${data.contact_email}, ${data.contact_phone},
        ${data.address}, ${data.city}, ${data.state}, ${data.country}, ${data.zip_code},
        ${data.status || "active"}, ${data.client_type || "corporate"}, ${data.priority || "medium"},
        ${data.commission_type || "percentage"}, ${data.commission_rate}, ${data.commission_flat_fee}, 
        ${data.payment_terms}, ${data.currency || "USD"},
        ${data.contract_start_date}, ${data.contract_end_date}, ${data.contract_status || "active"},
        ${data.rating || 0}, ${data.notes}, ${data.tags || []}
      )
      RETURNING *
    `;

    return Response.json({ client: result[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating client:", error);
    return Response.json({ error: "Failed to create client" }, { status: 500 });
  }
}
