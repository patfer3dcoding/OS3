import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let query = `
      SELECT cp.*, c.name as candidate_name, c.email as candidate_email, c.photo_url,
             j.title as job_title, j.department
      FROM client_placements cp
      LEFT JOIN candidates c ON cp.candidate_id = c.id
      LEFT JOIN jobs j ON cp.job_id = j.id
      WHERE cp.client_id = $1
    `;
    const values = [id];

    if (status) {
      query += ` AND cp.status = $2`;
      values.push(status);
    }

    query += ` ORDER BY cp.created_at DESC`;

    const placements = await sql(query, values);

    return Response.json({ placements });
  } catch (error) {
    console.error("Error fetching placements:", error);
    return Response.json(
      { error: "Failed to fetch placements" },
      { status: 500 },
    );
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();

    const result = await sql`
      INSERT INTO client_placements (
        client_id, candidate_id, job_id, status,
        position_title, annual_salary,
        commission_percentage, commission_amount, placement_fee,
        payment_status, start_date, notes
      ) VALUES (
        ${id}, ${data.candidate_id}, ${data.job_id}, ${data.status || "pending"},
        ${data.position_title}, ${data.annual_salary},
        ${data.commission_percentage}, ${data.commission_amount}, ${data.placement_fee},
        ${data.payment_status || "pending"}, ${data.start_date}, ${data.notes}
      )
      RETURNING *
    `;

    return Response.json({ placement: result[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating placement:", error);
    return Response.json(
      { error: "Failed to create placement" },
      { status: 500 },
    );
  }
}
