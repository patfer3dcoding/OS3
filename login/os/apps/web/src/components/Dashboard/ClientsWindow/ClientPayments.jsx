import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
} from "lucide-react";

export function ClientPayments({ payments, clientId }) {
  const [showAddPayment, setShowAddPayment] = useState(false);

  const stats = {
    total: payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0),
    pending: payments
      .filter((p) => p.status === "pending")
      .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0),
    completed: payments
      .filter((p) => p.status === "completed")
      .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0),
  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-xl p-6 shadow-lg">
          <DollarSign size={32} className="mb-2" />
          <p className="text-sm opacity-90">Total Payments</p>
          <p className="text-3xl font-bold">${stats.total.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-xl p-6 shadow-lg">
          <Clock size={32} className="mb-2" />
          <p className="text-sm opacity-90">Pending</p>
          <p className="text-3xl font-bold">
            ${stats.pending.toLocaleString()}
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-xl p-6 shadow-lg">
          <CheckCircle size={32} className="mb-2" />
          <p className="text-sm opacity-90">Completed</p>
          <p className="text-3xl font-bold">
            ${stats.completed.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Add Payment Button */}
      <button
        onClick={() => setShowAddPayment(true)}
        className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        <Plus size={20} />
        Record Payment
      </button>

      {/* Payments List */}
      <div className="space-y-4">
        {payments.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No payments recorded
          </div>
        ) : (
          payments.map((payment) => (
            <PaymentCard key={payment.id} payment={payment} />
          ))
        )}
      </div>

      {showAddPayment && (
        <AddPaymentModal
          clientId={clientId}
          onClose={() => setShowAddPayment(false)}
        />
      )}
    </div>
  );
}

function PaymentCard({ payment }) {
  const statusConfig = {
    pending: {
      color: "bg-yellow-50 border-yellow-300",
      badge: "bg-yellow-100 text-yellow-700",
    },
    completed: {
      color: "bg-green-50 border-green-300",
      badge: "bg-green-100 text-green-700",
    },
    overdue: {
      color: "bg-red-50 border-red-300",
      badge: "bg-red-100 text-red-700",
    },
  };

  const config = statusConfig[payment.status] || statusConfig.pending;

  return (
    <div
      className={`bg-white rounded-xl shadow-lg p-6 border-2 ${config.color} hover:shadow-xl transition-shadow`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white p-2 rounded-lg">
              <DollarSign size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 text-lg">
                ${parseFloat(payment.amount).toLocaleString()}
              </h4>
              <p className="text-sm text-gray-600">
                {payment.invoice_number || `Payment #${payment.id}`}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div>
              <p className="text-xs text-gray-500">Payment Date</p>
              <p className="font-medium text-gray-800">
                {payment.payment_date
                  ? new Date(payment.payment_date).toLocaleDateString()
                  : "Not paid"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Due Date</p>
              <p className="font-medium text-gray-800">
                {payment.due_date
                  ? new Date(payment.due_date).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Method</p>
              <p className="font-medium text-gray-800 capitalize">
                {payment.payment_method || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Transaction ID</p>
              <p className="font-medium text-gray-800">
                {payment.transaction_id || "N/A"}
              </p>
            </div>
          </div>

          {payment.notes && (
            <p className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              {payment.notes}
            </p>
          )}
        </div>

        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${config.badge}`}
        >
          {payment.status}
        </span>
      </div>
    </div>
  );
}

function AddPaymentModal({ clientId, onClose }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    amount: "",
    payment_date: "",
    due_date: "",
    status: "pending",
    payment_method: "",
    transaction_id: "",
    invoice_number: "",
    notes: "",
  });

  const addPaymentMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch(`/api/clients/${clientId}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to add payment");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client", clientId] });
      onClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addPaymentMutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          Record Payment
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Date
              </label>
              <input
                type="date"
                value={formData.payment_date}
                onChange={(e) =>
                  setFormData({ ...formData, payment_date: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) =>
                  setFormData({ ...formData, due_date: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <input
                type="text"
                value={formData.payment_method}
                onChange={(e) =>
                  setFormData({ ...formData, payment_method: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invoice Number
              </label>
              <input
                type="text"
                value={formData.invoice_number}
                onChange={(e) =>
                  setFormData({ ...formData, invoice_number: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg transition-all duration-300"
            >
              Record Payment
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-lg transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
