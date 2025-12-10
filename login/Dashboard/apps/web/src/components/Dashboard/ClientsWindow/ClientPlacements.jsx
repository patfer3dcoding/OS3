import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  User,
  Briefcase,
} from "lucide-react";

export function ClientPlacements({ clientId, placements, onAddPlacement }) {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("");

  const approvePlacementMutation = useMutation({
    mutationFn: async ({ placementId }) => {
      const response = await fetch(`/api/clients/placements/${placementId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "approved",
          approval_date: new Date().toISOString(),
        }),
      });
      if (!response.ok) throw new Error("Failed to approve placement");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client", clientId] });
    },
  });

  const denyPlacementMutation = useMutation({
    mutationFn: async ({ placementId }) => {
      const response = await fetch(`/api/clients/placements/${placementId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "denied",
        }),
      });
      if (!response.ok) throw new Error("Failed to deny placement");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client", clientId] });
    },
  });

  const filteredPlacements = statusFilter
    ? placements.filter((p) => p.status === statusFilter)
    : placements;

  const stats = {
    pending: placements.filter((p) => p.status === "pending").length,
    approved: placements.filter((p) => p.status === "approved").length,
    denied: placements.filter((p) => p.status === "denied").length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <StatBadge
            label="Pending"
            value={stats.pending}
            color="bg-yellow-100 text-yellow-700"
          />
          <StatBadge
            label="Approved"
            value={stats.approved}
            color="bg-green-100 text-green-700"
          />
          <StatBadge
            label="Denied"
            value={stats.denied}
            color="bg-red-100 text-red-700"
          />
        </div>
        <button
          onClick={onAddPlacement}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus size={20} />
          Add Placement
        </button>
      </div>

      {/* Filter */}
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
      >
        <option value="">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="denied">Denied</option>
      </select>

      {/* Placements List */}
      <div className="space-y-4">
        {filteredPlacements.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No placements found
          </div>
        ) : (
          filteredPlacements.map((placement) => (
            <PlacementCard
              key={placement.id}
              placement={placement}
              onApprove={() =>
                approvePlacementMutation.mutate({ placementId: placement.id })
              }
              onDeny={() =>
                denyPlacementMutation.mutate({ placementId: placement.id })
              }
            />
          ))
        )}
      </div>
    </div>
  );
}

function StatBadge({ label, value, color }) {
  return (
    <div className={`${color} px-4 py-2 rounded-lg`}>
      <p className="text-sm font-medium">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function PlacementCard({ placement, onApprove, onDeny }) {
  const statusConfig = {
    pending: {
      icon: Clock,
      color: "border-yellow-500 bg-yellow-50",
      textColor: "text-yellow-700",
    },
    approved: {
      icon: CheckCircle,
      color: "border-green-500 bg-green-50",
      textColor: "text-green-700",
    },
    denied: {
      icon: XCircle,
      color: "border-red-500 bg-red-50",
      textColor: "text-red-700",
    },
  };

  const config = statusConfig[placement.status] || statusConfig.pending;
  const StatusIcon = config.icon;

  return (
    <div
      className={`bg-white rounded-xl shadow-lg p-6 border-2 ${config.color} transition-all duration-300 hover:shadow-xl`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white p-2 rounded-lg">
              <User size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 text-lg">
                {placement.candidate_name}
              </h4>
              <p className="text-sm text-gray-600">
                {placement.candidate_email}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div>
              <p className="text-xs text-gray-500">Position</p>
              <p className="font-medium text-gray-800">
                {placement.position_title || placement.job_title || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Annual Salary</p>
              <p className="font-medium text-gray-800">
                {placement.annual_salary
                  ? `$${parseFloat(placement.annual_salary).toLocaleString()}`
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Commission</p>
              <p className="font-medium text-gray-800">
                {placement.commission_amount
                  ? `$${parseFloat(placement.commission_amount).toLocaleString()}`
                  : placement.commission_percentage
                    ? `${placement.commission_percentage}%`
                    : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Start Date</p>
              <p className="font-medium text-gray-800">
                {placement.start_date
                  ? new Date(placement.start_date).toLocaleDateString()
                  : "TBD"}
              </p>
            </div>
          </div>

          {placement.notes && (
            <p className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              {placement.notes}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-3 ml-4">
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-full ${config.color}`}
          >
            <StatusIcon size={16} className={config.textColor} />
            <span
              className={`text-sm font-semibold capitalize ${config.textColor}`}
            >
              {placement.status}
            </span>
          </div>

          {placement.status === "pending" && (
            <div className="flex gap-2">
              <button
                onClick={onApprove}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 text-sm"
              >
                <CheckCircle size={16} />
                Approve
              </button>
              <button
                onClick={onDeny}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 text-sm"
              >
                <XCircle size={16} />
                Deny
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
