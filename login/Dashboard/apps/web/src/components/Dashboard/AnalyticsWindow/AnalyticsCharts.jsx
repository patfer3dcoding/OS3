import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];

export function AnalyticsCharts({
  candidatesByStatus = [],
  applicationsByStatus = [],
  candidatesByMonth = [],
}) {
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Candidates by Status Pie Chart */}
      <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
        <h3 className="text-lg font-semibold text-white mb-4">
          Candidates by Status
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={candidatesByStatus}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={(entry) => `${entry.status}: ${entry.count}`}
            >
              {candidatesByStatus.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Application Status Bar Chart */}
      <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
        <h3 className="text-lg font-semibold text-white mb-4">
          Application Pipeline
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={applicationsByStatus}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.1)"
            />
            <XAxis dataKey="status" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Candidate Growth Line Chart */}
      <div className="p-6 bg-white/5 border border-white/10 rounded-xl col-span-2">
        <h3 className="text-lg font-semibold text-white mb-4">
          Candidate Growth (Last 6 Months)
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={candidatesByMonth}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.1)"
            />
            <XAxis dataKey="month" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Candidates"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
