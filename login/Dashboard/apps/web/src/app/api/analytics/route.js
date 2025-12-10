import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    // Get all analytics data in parallel
    const [
      totalCandidates,
      totalJobs,
      totalApplications,
      candidatesByStatus,
      jobsByStatus,
      recentCandidates,
      recentJobs,
      applicationsByStatus,
      candidatesByMonth,
    ] = await sql.transaction([
      sql`SELECT COUNT(*) as count FROM candidates`,
      sql`SELECT COUNT(*) as count FROM jobs`,
      sql`SELECT COUNT(*) as count FROM applications`,
      sql`SELECT status, COUNT(*) as count FROM candidates GROUP BY status`,
      sql`SELECT status, COUNT(*) as count FROM jobs GROUP BY status`,
      sql`SELECT * FROM candidates ORDER BY created_at DESC LIMIT 5`,
      sql`SELECT * FROM jobs ORDER BY created_at DESC LIMIT 5`,
      sql`SELECT status, COUNT(*) as count FROM applications GROUP BY status`,
      sql`
        SELECT 
          TO_CHAR(created_at, 'Mon') as month,
          COUNT(*) as count
        FROM candidates
        WHERE created_at >= CURRENT_DATE - INTERVAL '6 months'
        GROUP BY TO_CHAR(created_at, 'Mon'), DATE_TRUNC('month', created_at)
        ORDER BY DATE_TRUNC('month', created_at)
      `,
    ]);

    return Response.json({
      success: true,
      analytics: {
        totals: {
          candidates: parseInt(totalCandidates[0].count),
          jobs: parseInt(totalJobs[0].count),
          applications: parseInt(totalApplications[0].count),
          hireRate: 23.5, // Mock calculation
        },
        candidatesByStatus,
        jobsByStatus,
        applicationsByStatus,
        candidatesByMonth,
        recentCandidates,
        recentJobs,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
