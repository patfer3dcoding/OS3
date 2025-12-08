import db from "@/app/api/utils/db";

export async function loader({ params }) {
  const { id } = params;
  try {
    const client = db.prepare('SELECT * FROM clients WHERE id = ?').get(id);

    if (!client) {
      return Response.json(
        { success: false, error: "Client not found" },
        { status: 404 },
      );
    }

    // Mock sub-data for UI demo purposes
    const placements = [
      { id: 1, candidate_name: "John Doe", position: "Senior Dev", start_date: "2024-01-15", fee: 25000, status: "active" },
      { id: 2, candidate_name: "Jane Smith", position: "Product Owner", start_date: "2024-03-01", fee: 20000, status: "pending" }
    ];

    const payments = [
      { id: 101, invoice_id: "INV-2024-001", amount: 12500, date: "2024-02-01", status: "paid" },
      { id: 102, invoice_id: "INV-2024-002", amount: 12500, date: "2024-03-01", status: "pending" }
    ];

    const interactions = [
      { id: 201, type: "call", note: "Discussed Q3 hiring plans", date: "2024-06-10", author: "You" },
      { id: 202, type: "email", note: "Sent contract for review", date: "2024-06-08", author: "You" }
    ];

    const contacts = [
      { id: 301, name: "Mike Manager", role: "Hiring Manager", email: "mike@example.com", phone: "555-0123" },
      { id: 302, name: "Lisa HR", role: "HR Director", email: "lisa@example.com", phone: "555-0124" }
    ];

    return Response.json({
      success: true,
      client,
      placements,
      payments,
      interactions,
      contacts
    });
  } catch (error) {
    console.error("Error fetching client details:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
