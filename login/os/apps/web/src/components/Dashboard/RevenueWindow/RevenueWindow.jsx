"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  CreditCard,
  Plus,
  X,
  Loader2,
} from "lucide-react";

export function RevenueWindow() {
  const queryClient = useQueryClient();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [newPayment, setNewPayment] = useState({
    client_id: "",
    amount: "",
    type: "Placement Fee",
    status: "Paid",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const { data: paymentsData = { payments: [] } } = useQuery({
    queryKey: ["revenue"],
    queryFn: async () => {
      const res = await fetch("/api/revenue");
      if (!res.ok) throw new Error("Failed to fetch revenue");
      return res.json();
    },
  });

  // Support clients fetch if endpoint exists, otherwise empty list
  const { data: clientsData = { clients: [] } } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/clients");
        if (!res.ok) return { clients: [] };
        return res.json();
      } catch (e) { return { clients: [] }; }
    },
  });

  const createPaymentMutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch("/api/revenue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create payment");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["revenue"]);
      setShowPaymentModal(false);
      setNewPayment({
        client_id: "",
        amount: "",
        type: "Placement Fee",
        status: "Paid",
        date: new Date().toISOString().split("T")[0],
        notes: "",
      });
    },
  });

  const payments = paymentsData.payments || [];
  const clients = clientsData.clients || [];

  // Calculate stats
  const totalRevenue = payments
    .filter(p => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingRevenue = payments
    .filter(p => p.status === 'Pending')
    .reduce((sum, p) => sum + p.amount, 0);

  // Simple monthly aggregation for chart (last 6 months)
  const monthlyRevenue = calculateMonthlyRevenue(payments);
  const currentMonthRev = monthlyRevenue[monthlyRevenue.length - 1]?.revenue || 0;
  const lastMonthRev = monthlyRevenue[monthlyRevenue.length - 2]?.revenue || 0;
  const growth = lastMonthRev > 0
    ? (((currentMonthRev - lastMonthRev) / lastMonthRev) * 100).toFixed(1)
    : 100;

  function calculateMonthlyRevenue(payments) {
    const months = {};
    const today = new Date();
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const key = d.toLocaleString('default', { month: 'short' });
      months[key] = { month: key, revenue: 0, placements: 0 };
    }

    payments.forEach(p => {
      if (p.status !== 'Paid') return;
      const d = new Date(p.date);
      const key = d.toLocaleString('default', { month: 'short' });
      if (months[key]) {
        months[key].revenue += p.amount;
        months[key].placements += 1;
      }
    });
    return Object.values(months);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    createPaymentMutation.mutate({
      ...newPayment,
      amount: Number(newPayment.amount)
    });
  };

  return (
    <div className="h-full bg-gradient-to-br from-green-50 to-emerald-50 overflow-auto p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Revenue Tracking
            </h2>
            <p className="text-gray-600">Monitor your financial performance</p>
          </div>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus size={20} />
            Record Payment
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-200 transform hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white w-12 h-12 rounded-lg flex items-center justify-center mb-3">
              <DollarSign size={24} />
            </div>
            <p className="text-3xl font-bold text-gray-800">
              ${(currentMonthRev / 1000).toFixed(0)}K
            </p>
            <p className="text-sm text-gray-600">This Month</p>
            <p className="text-xs text-green-600 font-medium mt-1">
              {growth > 0 ? '+' : ''}{growth}% vs last month
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-200 transform hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white w-12 h-12 rounded-lg flex items-center justify-center mb-3">
              <TrendingUp size={24} />
            </div>
            <p className="text-3xl font-bold text-gray-800">
              ${(totalRevenue / 1000).toFixed(0)}K
            </p>
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-xs text-blue-600 font-medium mt-1">Lifetime</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-200 transform hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white w-12 h-12 rounded-lg flex items-center justify-center mb-3">
              <Calendar size={24} />
            </div>
            <p className="text-3xl font-bold text-gray-800">
              ${((totalRevenue / (monthlyRevenue.length || 1)) / 1000).toFixed(0)}K
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
            <p className="text-3xl font-bold text-gray-800">${(pendingRevenue / 1000).toFixed(0)}K</p>
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-xs text-orange-600 font-medium mt-1">
              {payments.filter(p => p.status === 'Pending').length} invoices
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
              const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.revenue), 100000); // min scale
              const heightPercent = Math.max((month.revenue / maxRevenue) * 100, 5);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col items-center justify-end" style={{ height: "100%" }}>
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
            {payments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No transactions recorded yet.</p>
            ) : (
              payments.slice(0, 5).map((transaction) => (
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
                        {transaction.client || "Client " + transaction.client_id}
                      </h4>
                      <p className="text-sm text-gray-600">{transaction.type}</p>
                      <p className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      ${(transaction.amount / 1000).toFixed(1)}K
                    </p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${transaction.status === "Paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Record Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md animate-fadeIn">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Record Payment</h3>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client
                  </label>
                  <select
                    required
                    value={newPayment.client_id}
                    onChange={(e) => setNewPayment({ ...newPayment, client_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select Client</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>{client.company_name}</option>
                    ))}
                    {clients.length === 0 && <option value="client-1">Demo Client 1</option>}
                    {clients.length === 0 && <option value="client-2">Demo Client 2</option>}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={newPayment.type}
                    onChange={(e) => setNewPayment({ ...newPayment, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="Placement Fee">Placement Fee</option>
                    <option value="Retainer">Retainer</option>
                    <option value="Consulting">Consulting</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newPayment.date}
                    onChange={(e) => setNewPayment({ ...newPayment, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={newPayment.status}
                    onChange={(e) => setNewPayment({ ...newPayment, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createPaymentMutation.isPending}
                    className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-green-500/30 flex items-center justify-center gap-2"
                  >
                    {createPaymentMutation.isPending && (
                      <Loader2 className="animate-spin" size={20} />
                    )}
                    Record Payment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


