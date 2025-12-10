"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Users,
  Briefcase,
  FileSpreadsheet,
  Loader2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export function ReportsWindow() {
  const [reportType, setReportType] = useState("monthly");
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1))
      .toISOString()
      .split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });
  const [generatedReport, setGeneratedReport] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: candidates = [] } = useQuery({
    queryKey: ["candidates"],
    queryFn: async () => {
      const res = await fetch("/api/candidates");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      return data.candidates || [];
    },
  });

  const { data: jobs = [] } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const res = await fetch("/api/jobs");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      return data.jobs || [];
    },
  });

  const { data: interviews = [] } = useQuery({
    queryKey: ["interviews"],
    queryFn: async () => {
      const res = await fetch("/api/interviews");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      return data.interviews || [];
    },
  });

  // Filter data by date range
  const filteredData = useMemo(() => {
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);

    return {
      candidates: candidates.filter((c) => {
        const date = new Date(c.created_at);
        return date >= startDate && date <= endDate;
      }),
      jobs: jobs.filter((j) => {
        const date = new Date(j.created_at);
        return date >= startDate && date <= endDate;
      }),
      interviews: interviews.filter((i) => {
        const date = new Date(i.interview_date);
        return date >= startDate && date <= endDate;
      }),
    };
  }, [candidates, jobs, interviews, dateRange]);

  // Calculate report metrics
  const reportMetrics = useMemo(() => {
    const statusBreakdown = filteredData.candidates.reduce((acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    }, {});

    const jobStatusBreakdown = filteredData.jobs.reduce((acc, j) => {
      acc[j.status] = (acc[j.status] || 0) + 1;
      return acc;
    }, {});

    const interviewTypeBreakdown = filteredData.interviews.reduce((acc, i) => {
      acc[i.type] = (acc[i.type] || 0) + 1;
      return acc;
    }, {});

    // Time series data - group by week
    const weeklyData = {};
    filteredData.candidates.forEach((c) => {
      const week = getWeekKey(new Date(c.created_at));
      if (!weeklyData[week])
        weeklyData[week] = { candidates: 0, interviews: 0 };
      weeklyData[week].candidates++;
    });

    filteredData.interviews.forEach((i) => {
      const week = getWeekKey(new Date(i.interview_date));
      if (!weeklyData[week])
        weeklyData[week] = { candidates: 0, interviews: 0 };
      weeklyData[week].interviews++;
    });

    const timeSeriesData = Object.entries(weeklyData)
      .map(([week, data]) => ({ week, ...data }))
      .sort((a, b) => a.week.localeCompare(b.week));

    return {
      totalCandidates: filteredData.candidates.length,
      totalJobs: filteredData.jobs.length,
      totalInterviews: filteredData.interviews.length,
      hiredCount: filteredData.candidates.filter((c) => c.status === "hired")
        .length,
      statusBreakdown,
      jobStatusBreakdown,
      interviewTypeBreakdown,
      timeSeriesData,
      avgTimeToHire: calculateAvgTimeToHire(filteredData.candidates),
      topSkills: getTopSkills(filteredData.candidates),
      conversionRate:
        filteredData.candidates.length > 0
          ? (
              (filteredData.candidates.filter((c) => c.status === "hired")
                .length /
                filteredData.candidates.length) *
              100
            ).toFixed(1)
          : 0,
    };
  }, [filteredData]);

  function getWeekKey(date) {
    const year = date.getFullYear();
    const weekNum = Math.ceil(
      ((date - new Date(year, 0, 1)) / 86400000 + 1) / 7,
    );
    return `${year}-W${weekNum.toString().padStart(2, "0")}`;
  }

  function calculateAvgTimeToHire(candidates) {
    const hired = candidates.filter(
      (c) => c.status === "hired" && c.created_at,
    );
    if (hired.length === 0) return "N/A";

    const avgDays =
      hired.reduce((sum, c) => {
        const days = Math.floor(
          (new Date() - new Date(c.created_at)) / (1000 * 60 * 60 * 24),
        );
        return sum + days;
      }, 0) / hired.length;

    return `${Math.round(avgDays)} days`;
  }

  function getTopSkills(candidates) {
    const skillCount = {};
    candidates.forEach((c) => {
      if (c.skills && Array.isArray(c.skills)) {
        c.skills.forEach((skill) => {
          skillCount[skill] = (skillCount[skill] || 0) + 1;
        });
      }
    });

    return Object.entries(skillCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([skill, count]) => ({ skill, count }));
  }

  const reportTemplates = [
    {
      id: "hiring",
      name: "Hiring Activity Report",
      description: "Comprehensive overview of hiring activities",
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "candidates",
      name: "Candidate Pipeline Report",
      description: "Track candidate progress through stages",
      icon: Users,
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "jobs",
      name: "Job Performance Report",
      description: "Analyze job posting effectiveness",
      icon: Briefcase,
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "monthly",
      name: "Monthly Summary",
      description: "Month-over-month recruiting metrics",
      icon: Calendar,
      color: "from-orange-500 to-red-500",
    },
  ];

  const generateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedReport(reportMetrics);
      setIsGenerating(false);
    }, 1000);
  };

  const exportToPDF = () => {
    alert(
      "PDF export would be implemented here with a PDF generation library. For now, try CSV export!",
    );
  };

  const exportToCSV = () => {
    let csvContent = `Recruitment Report - ${reportTemplates.find((t) => t.id === reportType)?.name}\n`;
    csvContent += `Date Range: ${dateRange.start} to ${dateRange.end}\n\n`;

    csvContent += `Summary Metrics\n`;
    csvContent += `Total Candidates,${reportMetrics.totalCandidates}\n`;
    csvContent += `Total Jobs,${reportMetrics.totalJobs}\n`;
    csvContent += `Total Interviews,${reportMetrics.totalInterviews}\n`;
    csvContent += `Hired Count,${reportMetrics.hiredCount}\n`;
    csvContent += `Conversion Rate,${reportMetrics.conversionRate}%\n`;
    csvContent += `Avg Time to Hire,${reportMetrics.avgTimeToHire}\n\n`;

    csvContent += `Candidate Status Breakdown\n`;
    csvContent += `Status,Count\n`;
    Object.entries(reportMetrics.statusBreakdown).forEach(([status, count]) => {
      csvContent += `${status},${count}\n`;
    });

    csvContent += `\nTop Skills\n`;
    csvContent += `Skill,Count\n`;
    reportMetrics.topSkills.forEach(({ skill, count }) => {
      csvContent += `${skill},${count}\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `recruitment_report_${reportType}_${Date.now()}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const COLORS = [
    "#3B82F6",
    "#8B5CF6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#EC4899",
  ];

  const stats = [
    {
      label: "Total Candidates",
      value: candidates.length,
      color: "bg-blue-500",
      icon: Users,
    },
    {
      label: "Active Jobs",
      value: jobs.filter((j) => j.status === "open").length,
      color: "bg-green-500",
      icon: Briefcase,
    },
    {
      label: "New This Month",
      value: candidates.filter((c) => {
        const created = new Date(c.created_at);
        const now = new Date();
        return (
          created.getMonth() === now.getMonth() &&
          created.getFullYear() === now.getFullYear()
        );
      }).length,
      color: "bg-purple-500",
      icon: TrendingUp,
    },
    {
      label: "Hired",
      value: candidates.filter((c) => c.status === "hired").length,
      color: "bg-emerald-500",
      icon: Users,
    },
  ];

  return (
    <div className="h-full bg-gradient-to-br from-yellow-50 to-orange-50 overflow-auto p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Reports & Analytics
          </h2>
          <p className="text-gray-600">
            Generate comprehensive recruiting reports with data visualization
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-lg p-5 border border-gray-200 transform hover:scale-105 transition-all duration-300"
              >
                <div
                  className={`${stat.color} text-white w-12 h-12 rounded-lg flex items-center justify-center mb-3`}
                >
                  <Icon size={24} />
                </div>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Report Templates */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Report Templates
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <div
                  key={template.id}
                  onClick={() => setReportType(template.id)}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    reportType === template.id
                      ? "border-yellow-500 bg-yellow-50"
                      : "border-gray-200 hover:border-yellow-300"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`bg-gradient-to-br ${template.color} text-white p-3 rounded-lg`}
                    >
                      <Icon size={24} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">
                        {template.name}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {template.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Report Generator */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Generate Report
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange({ ...dateRange, start: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange({ ...dateRange, end: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={generateReport}
              disabled={isGenerating}
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:scale-100 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText size={20} />
                  Generate Report
                </>
              )}
            </button>
            <button
              onClick={exportToCSV}
              disabled={!generatedReport}
              className="px-6 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg transition-all duration-300 flex items-center gap-2"
            >
              <FileSpreadsheet size={20} />
              Export CSV
            </button>
            <button
              onClick={exportToPDF}
              disabled={!generatedReport}
              className="px-6 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white py-3 rounded-lg transition-all duration-300 flex items-center gap-2"
            >
              <Download size={20} />
              Export PDF
            </button>
          </div>
        </div>

        {/* Generated Report with Charts */}
        {generatedReport && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  Total Candidates
                </h4>
                <p className="text-3xl font-bold text-blue-600">
                  {generatedReport.totalCandidates}
                </p>
                <p className="text-sm text-gray-500 mt-1">In selected period</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  Hired
                </h4>
                <p className="text-3xl font-bold text-green-600">
                  {generatedReport.hiredCount}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Conversion: {generatedReport.conversionRate}%
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  Avg Time to Hire
                </h4>
                <p className="text-3xl font-bold text-purple-600">
                  {generatedReport.avgTimeToHire}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  From application to hire
                </p>
              </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Candidate Status Breakdown */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Candidate Status Breakdown
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={Object.entries(generatedReport.statusBreakdown).map(
                        ([name, value]) => ({ name, value }),
                      )}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {Object.entries(generatedReport.statusBreakdown).map(
                        (entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ),
                      )}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Activity Timeline */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Activity Timeline
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={generatedReport.timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="candidates"
                      stroke="#3B82F6"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="interviews"
                      stroke="#10B981"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Skills */}
            {generatedReport.topSkills.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Top Skills in Candidate Pool
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={generatedReport.topSkills}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="skill" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Interview Types */}
            {Object.keys(generatedReport.interviewTypeBreakdown).length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Interview Types
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(generatedReport.interviewTypeBreakdown).map(
                    ([type, count]) => (
                      <div
                        key={type}
                        className="bg-gray-50 p-4 rounded-lg text-center"
                      >
                        <p className="text-2xl font-bold text-gray-800">
                          {count}
                        </p>
                        <p className="text-sm text-gray-600 capitalize">
                          {type}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
