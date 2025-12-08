import db from "@/app/api/utils/db";

export async function loader() {
  try {
    // Get all analytics data
    const totalCandidates = db.prepare('SELECT COUNT(*) as count FROM candidates').get();
    const totalJobs = db.prepare('SELECT COUNT(*) as count FROM jobs').get();
    const totalApplications = db.prepare('SELECT COUNT(*) as count FROM applications').get();

    const candidatesByStatus = db.prepare('SELECT status, COUNT(*) as count FROM candidates GROUP BY status').all();
    const jobsByStatus = db.prepare('SELECT status, COUNT(*) as count FROM jobs GROUP BY status').all();
    const applicationsByStatus = db.prepare('SELECT status, COUNT(*) as count FROM applications GROUP BY status').all();

    const recentCandidates = db.prepare('SELECT * FROM candidates ORDER BY created_at DESC LIMIT 5').all();
    const recentJobs = db.prepare('SELECT * FROM jobs ORDER BY created_at DESC LIMIT 5').all();

    // Candidates by Month (SQLite implementation)
    const candidatesByMonth = db.prepare(`
      SELECT 
        strftime('%m', created_at) as month_num,
        CASE strftime('%m', created_at)
          WHEN '01' THEN 'Jan'
          WHEN '02' THEN 'Feb'
          WHEN '03' THEN 'Mar'
          WHEN '04' THEN 'Apr'
          WHEN '05' THEN 'May'
          WHEN '06' THEN 'Jun'
          WHEN '07' THEN 'Jul'
          WHEN '08' THEN 'Aug'
          WHEN '09' THEN 'Sep'
          WHEN '10' THEN 'Oct'
          WHEN '11' THEN 'Nov'
          WHEN '12' THEN 'Dec'
        END as month,
        COUNT(*) as count
      FROM candidates
      WHERE created_at >= date('now', '-6 months')
      GROUP BY strftime('%m', created_at)
      ORDER BY strftime('%m', created_at)
    `).all();

    return Response.json({
      success: true,
      analytics: {
        totals: {
          candidates: totalCandidates.count,
          jobs: totalJobs.count,
          applications: totalApplications.count,
          hireRate: 23.5, // Mock calculation or could derive from data
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
