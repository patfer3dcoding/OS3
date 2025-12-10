"use client";

import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  CreditCard,
} from "lucide-react";

export function RevenueWindow() {
  const monthlyRevenue = [
    { month: "Jan", revenue: 125000, placements: 15 },
    { month: "Feb", revenue: 142000, placements: 18 },
    { month: "Mar", revenue: 156000, placements: 21 },
    { month: "Apr", revenue: 148000, placements: 19 },
    { month: "May", revenue: 167000, placements: 24 },
    { month: "Jun", revenue: 189000, placements: 27 },
  ];

  const recentTransactions = [
    {
      id: 1,
      client: "Tech Innovations Inc.",
      amount: 25000,
      type: "Placement Fee",
      date: "2024-06-15",
      status: "Paid",
    },
    {
      id: 2,
      client: "Global Finance Corp",
      amount: 18000,
      type: "Retainer",
      date: "2024-06-12",
      status: "Paid",
    },
    {
      id: 3,
      client: "Healthcare Solutions",
      amount: 22000,
      type: "Placement Fee",
      date: "2024-06-10",
      status: "Pending",
    },
    {
      id: 4,
      client: "Retail Dynamics",
      amount: 15000,
      type: "Placement Fee",
      date: "2024-06-08",
      status: "Paid",
    },
  ];

  const totalRevenue = monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0);
  const avgRevenue = Math.round(totalRevenue / monthlyRevenue.length);
  const currentMonth = monthlyRevenue[monthlyRevenue.length - 1];
  const lastMonth = monthlyRevenue[monthlyRevenue.length - 2];
  const growth = (
    ((currentMonth.revenue - lastMonth.revenue) / lastMonth.revenue) *
    100
  ).toFixed(1);

  return (
    <div className="h-full bg-gradient-to-br from-green-50 to-emerald-50 overflow-auto p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Revenue Tracking
          </h2>
          <p className="text-gray-600">Monitor your financial performance</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-200 transform hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white w-12 h-12 rounded-lg flex items-center justify-center mb-3">
              <DollarSign size={24} />
            </div>
            <p className="text-3xl font-bold text-gray-800">
              ${(currentMonth.revenue / 1000).toFixed(0)}K
            </p>
            <p className="text-sm text-gray-600">This Month</p>
            <p className="text-xs text-green-600 font-medium mt-1">
              +{growth}% vs last month
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-200 transform hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white w-12 h-12 rounded-lg flex items-center justify-center mb-3">
              <TrendingUp size={24} />
            </div>
            <p className="text-3xl font-bold text-gray-800">
              ${(totalRevenue / 1000).toFixed(0)}K
            </p>
            <p className="text-sm text-gray-600">YTD Revenue</p>
            <p className="text-xs text-blue-600 font-medium mt-1">6 months</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-200 transform hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white w-12 h-12 rounded-lg flex items-center justify-center mb-3">
              <Calendar size={24} />
            </div>
            <p className="text-3xl font-bold text-gray-800">
              ${(avgRevenue / 1000).toFixed(0)}K
            </p>
            <p className="text-sm text-gray-600">Avg Monthly</p>
            <p className="text-xs text-purple-600 font-medium mt-1">
              Last 6 months
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-200 transform hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white w-12 h-12 rounded-lg flex items-center justify-center mb-3">
              <CreditCard size={24} />
            </div>
            <p className="text-3xl font-bold text-gray-800">$80K</p>
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-xs text-orange-600 font-medium mt-1">
              2 invoices
            </p>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Revenue Trend
          </h3>
          <div className="flex items-end gap-2 h-64">
            {monthlyRevenue.map((month, idx) => {
              const maxRevenue = Math.max(
                ...monthlyRevenue.map((m) => m.revenue),
              );
              const heightPercent = (month.revenue / maxRevenue) * 100;
              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div
                    className="w-full flex flex-col items-center justify-end"
                    style={{ height: "100%" }}
                  >
                    <div className="text-xs text-gray-600 mb-1">
                      ${(month.revenue / 1000).toFixed(0)}K
                    </div>
                    <div
                      className="w-full bg-gradient-to-t from-green-500 to-emerald-400 rounded-t-lg hover:from-green-600 hover:to-emerald-500 transition-all duration-300 cursor-pointer"
                      style={{ height: `${heightPercent}%` }}
                    ></div>
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    {month.month}
                  </div>
                  <div className="text-xs text-gray-500">
                    {month.placements} placements
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Transactions
          </h3>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white p-3 rounded-lg">
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {transaction.client}
                    </h4>
                    <p className="text-sm text-gray-600">{transaction.type}</p>
                    <p className="text-xs text-gray-500">{transaction.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">
                    ${(transaction.amount / 1000).toFixed(1)}K
                  </p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      transaction.status === "Paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
