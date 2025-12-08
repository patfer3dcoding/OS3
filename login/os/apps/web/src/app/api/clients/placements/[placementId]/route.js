import sql from "@/app/api/utils/sql";

export async function PUT(request, { params }) {
  try {
    const { placementId } = params;
    const data = await request.json();

    let query = "UPDATE client_placements SET updated_at = CURRENT_TIMESTAMP";
    const values = [];
    let paramCount = 0;

    const fields = [
      "status",
      "approval_date",
      "start_date",
      "placement_fee",
      "commission_percentage",
      "commission_amount",
      "payment_status",
      "payment_date",
      "position_title",
      "annual_salary",
      "notes",
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
    values.push(placementId);

    const result = await sql(query, values);

    if (result.length === 0) {
      return Response.json({ error: "Placement not found" }, { status: 404 });
    }

    // If approved, update client metrics
    if (data.status === "approved" && result[0].commission_amount) {
      await sql`
        UPDATE clients 
        SET total_placements = total_placements + 1,
            total_revenue = total_revenue + ${result[0].commission_amount}
        WHERE id = ${result[0].client_id}
      `;
    }

    return Response.json({ placement: result[0] });
  } catch (error) {
    console.error("Error updating placement:", error);
    return Response.json(
      { error: "Failed to update placement" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { placementId } = params;
    const result =
      await sql`DELETE FROM client_placements WHERE id = ${placementId} RETURNING *`;

    if (result.length === 0) {
      return Response.json({ error: "Placement not found" }, { status: 404 });
    }

    return Response.json({ message: "Placement deleted successfully" });
  } catch (error) {
    console.error("Error deleting placement:", error);
    return Response.json(
      { error: "Failed to delete placement" },
      { status: 500 },
    );
  }
}
