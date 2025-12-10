import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function PUT(request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const userId = session.user.id;

    // Build dynamic update query
    let query = "UPDATE auth_users SET";
    const values = [];
    let paramCount = 0;

    const allowedFields = [
      "name",
      "phone",
      "bio",
      "company",
      "department",
      "role",
      "location",
      "linkedin",
      "twitter",
      "github",
      "website",
      "image",
    ];

    const updates = [];
    allowedFields.forEach((field) => {
      if (data[field] !== undefined) {
        paramCount++;
        updates.push(`${field} = $${paramCount}`);
        values.push(data[field]);
      }
    });

    if (updates.length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    query += " " + updates.join(", ");
    paramCount++;
    query += ` WHERE id = $${paramCount} RETURNING *`;
    values.push(userId);

    const result = await sql(query, values);

    if (result.length === 0) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({
      success: true,
      user: result[0],
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return Response.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}
