import db from "@/app/api/utils/db";

export async function loader({ request }) {
    try {
        const payments = db.prepare(`
      SELECT 
        p.*,
        c.company_name as client
      FROM payments p
      LEFT JOIN clients c ON p.client_id = c.id
      ORDER BY p.date DESC
    `).all();

        return Response.json({ success: true, payments });
    } catch (error) {
        console.error("Error fetching payments:", error);
        return Response.json(
            { success: false, error: error.message },
            { status: 500 },
        );
    }
}

export async function action({ request }) {
    if (request.method !== 'POST') {
        return new Response("Method not allowed", { status: 405 });
    }

    try {
        const body = await request.json();
        const { client_id, amount, type, date, status, notes } = body;

        if (!client_id || !amount) {
            return Response.json(
                { success: false, error: "Client and Amount are required" },
                { status: 400 },
            );
        }

        const insert = db.prepare(`
      INSERT INTO payments (client_id, amount, type, status, date, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

        const info = insert.run(
            client_id,
            amount,
            type || 'Placement Fee',
            status || 'Pending',
            date || new Date().toISOString(),
            notes || ''
        );

        const payment = db.prepare('SELECT * FROM payments WHERE id = ?').get(info.lastInsertRowid);

        return Response.json({ success: true, payment });
    } catch (error) {
        console.error("Error creating payment:", error);
        return Response.json(
            { success: false, error: error.message },
            { status: 500 },
        );
    }
}
