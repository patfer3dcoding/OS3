import db from "../../utils/db.server";

import { demoRevenue } from "../../../utils/demoData";

export async function loader({ request }) {
    try {
        // Check for empty database and seed if needed
        const count = db.prepare('SELECT COUNT(*) as count FROM payments').get().count;
        if (count === 0) {
            console.log('Seeding demo revenue...');

            // Ensure we have a client to attach payments to
            // This assumes demoClients have been seeded or will be invalid without foreign key Constraints?
            // SQLite by default doesn't enforce FK unless enabled, but let's be safe.
            // We'll use 'demo-cl-1' if it exists, or just NULL if allowed, or insert a placeholder.
            // Assuming clients are seeded first or concurrently. 
            // Better to update demoRevenue to include client_id.
            // For now, I'll hardcode 'demo-cl-1' which is in my demoClients.

            const insert = db.prepare('INSERT INTO payments');

            const insertMany = db.transaction((payments) => {
                for (const p of payments) {
                    insert.run({
                        ...p,
                        client_id: 'demo-cl-1', // Linking to the first demo client
                        type: p.category || 'Placement Fee',
                        status: 'Completed',
                        notes: 'Demo Payment'
                    });
                }
            });

            insertMany(demoRevenue);
        }

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
