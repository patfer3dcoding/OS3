import sql from "@/app/api/utils/sql";

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const result =
      await sql`DELETE FROM email_templates WHERE id = ${id} RETURNING *`;

    if (result.length === 0) {
      return Response.json(
        { success: false, error: "Template not found" },
        { status: 404 },
      );
    }

    return Response.json({
      success: true,
      message: "Template deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting template:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
