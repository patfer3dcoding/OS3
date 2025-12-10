import sql from "../../../utils/sql";

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();

    // If this is set as primary, unset other primary contacts
    if (data.is_primary) {
      await sql`UPDATE client_contacts SET is_primary = false WHERE client_id = ${id}`;
    }

    const result = await sql`
      INSERT INTO client_contacts (
        client_id, name, title, email, phone, is_primary, notes
      ) VALUES (
        ${id}, ${data.name}, ${data.title}, ${data.email}, ${data.phone}, 
        ${data.is_primary || false}, ${data.notes}
      )
      RETURNING *
    `;

    return Response.json({ contact: result[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating contact:", error);
    return Response.json(
      { error: "Failed to create contact" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { searchParams } = new URL(request.url);
    const contactId = searchParams.get("contactId");

    const result =
      await sql`DELETE FROM client_contacts WHERE id = ${contactId} RETURNING *`;

    if (result.length === 0) {
      return Response.json({ error: "Contact not found" }, { status: 404 });
    }

    return Response.json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return Response.json(
      { error: "Failed to delete contact" },
      { status: 500 },
    );
  }
}
