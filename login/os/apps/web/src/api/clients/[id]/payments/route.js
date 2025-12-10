import sql from "@/api/utils/sql";

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();

    const result = await sql`
      INSERT INTO client_payments (
        client_id, placement_id, amount, payment_date, due_date,
        status, payment_method, transaction_id, invoice_number, notes
      ) VALUES (
        ${id}, ${data.placement_id}, ${data.amount}, ${data.payment_date}, ${data.due_date},
        ${data.status || "pending"}, ${data.payment_method}, ${data.transaction_id}, 
        ${data.invoice_number}, ${data.notes}
      )
      RETURNING *
    `;

    // Update client total revenue if payment is completed
    if (data.status === "completed") {
      await sql`
        UPDATE clients 
        SET total_revenue = total_revenue + ${data.amount}
        WHERE id = ${id}
      `;
    }

    return Response.json({ payment: result[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating payment:", error);
    return Response.json(
      { error: "Failed to create payment" },
      { status: 500 },
    );
  }
}
