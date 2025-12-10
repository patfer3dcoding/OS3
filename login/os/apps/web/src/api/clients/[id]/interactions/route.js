import sql from "@/api/utils/sql";

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();

    const result = await sql`
      INSERT INTO client_interactions (
        client_id, interaction_type, subject, description,
        interaction_date, contact_person, outcome,
        follow_up_required, follow_up_date, created_by
      ) VALUES (
        ${id}, ${data.interaction_type}, ${data.subject}, ${data.description},
        ${data.interaction_date || new Date()}, ${data.contact_person}, ${data.outcome},
        ${data.follow_up_required || false}, ${data.follow_up_date}, ${data.created_by}
      )
      RETURNING *
    `;

    return Response.json({ interaction: result[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating interaction:", error);
    return Response.json(
      { error: "Failed to create interaction" },
      { status: 500 },
    );
  }
}
