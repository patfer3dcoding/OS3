import db from "../../utils/db.server";

export async function action({ request }) {
    if (request.method !== 'POST') {
        return new Response("Method not allowed", { status: 405 });
    }

    try {
        const body = await request.json();
        const { job_id, name, email, phone, resume_url, cover_letter } = body;

        if (!job_id || !name || !email) {
            return Response.json(
                { success: false, error: "Missing required fields" },
                { status: 400 },
            );
        }

        // 1. Create Candidate
        const candidateId = `cand-${Date.now()}`; // Simple ID generation
        const createCandidate = db.prepare(`
        INSERT INTO candidates (id, name, email, phone, resume_url, status, created_at)
        VALUES (?, ?, ?, ?, ?, 'new', CURRENT_TIMESTAMP)
    `);

        try {
            createCandidate.run(candidateId, name, email, phone || null, resume_url || null);
        } catch (e) {
            // If candidate creation fails (e.g. email exists), check if we can reuse - simplified for now: fail or just continue if we could query.
            console.error("Error creating candidate:", e);
            // For this demo, let's assume we proceed. In a real app we'd look up by email.
            throw new Error("Failed to create candidate profile");
        }

        // 2. Create Application
        const applicationId = `app-${Date.now()}`;
        const createApplication = db.prepare(`
        INSERT INTO applications (id, candidate_id, job_id, status, applied_at)
        VALUES (?, ?, ?, 'new', CURRENT_TIMESTAMP)
    `);

        createApplication.run(applicationId, candidateId, job_id);

        return Response.json({ success: true, applicationId });
    } catch (error) {
        console.error("Error submitting application:", error);
        return Response.json(
            { success: false, error: error.message },
            { status: 500 },
        );
    }
}
