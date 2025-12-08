import { useQuery } from "@tanstack/react-query";
import { KPICards } from "./KPICards";
import { AnalyticsCharts } from "./AnalyticsCharts";

export function AnalyticsWindow() {
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const response = await fetch("/api/analytics");
      if (!response.ok) throw new Error("Failed to fetch analytics");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white/50">Loading analytics...</div>
      </div>
    );
  }

  const analytics = analyticsData?.analytics || {};

  return (
    <div className="p-6 overflow-auto h-full">
      <h2 className="text-2xl font-bold text-white mb-6">
        Recruiting Analytics
      </h2>

      <KPICards totals={analytics.totals} />
      <AnalyticsCharts
        candidatesByStatus={analytics.candidatesByStatus}
        applicationsByStatus={analytics.applicationsByStatus}
        candidatesByMonth={analytics.candidatesByMonth}
      />
    </div>
  );
}
