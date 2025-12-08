import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  MessageSquare,
  Phone,
  Video,
  Mail,
  Calendar,
  CheckCircle,
} from "lucide-react";

export function ClientInteractions({ interactions, clientId }) {
  const [showAddInteraction, setShowAddInteraction] = useState(false);

  const interactionTypes = {
    meeting: {
      icon: Video,
      color: "from-blue-500 to-cyan-500",
      badge: "bg-blue-100 text-blue-700",
    },
    call: {
      icon: Phone,
      color: "from-purple-500 to-pink-500",
      badge: "bg-purple-100 text-purple-700",
    },
    email: {
      icon: Mail,
      color: "from-green-500 to-emerald-500",
      badge: "bg-green-100 text-green-700",
    },
    note: {
      icon: MessageSquare,
      color: "from-orange-500 to-red-500",
      badge: "bg-orange-100 text-orange-700",
    },
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800">
          Interaction History
        </h3>
        <button
          onClick={() => setShowAddInteraction(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <Plus size={20} />
          Log Interaction
        </button>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {interactions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No interactions logged
          </div>
        ) : (
          interactions.map((interaction, index) => (
            <InteractionCard
              key={interaction.id}
              interaction={interaction}
              config={
                interactionTypes[interaction.interaction_type] ||
                interactionTypes.note
              }
              isLast={index === interactions.length - 1}
            />
          ))
        )}
      </div>

      {showAddInteraction && (
        <AddInteractionModal
          clientId={clientId}
          onClose={() => setShowAddInteraction(false)}
        />
      )}
    </div>
  );
}

function InteractionCard({ interaction, config, isLast }) {
  const Icon = config.icon;

  return (
    <div className="relative pl-8">
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute left-3 top-10 bottom-0 w-0.5 bg-gray-200" />
      )}

      {/* Timeline Dot */}
      <div
        className={`absolute left-0 top-3 bg-gradient-to-br ${config.color} text-white p-2 rounded-lg shadow-lg`}
      >
        <Icon size={16} />
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-200 hover:shadow-xl transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h4 className="font-semibold text-gray-800 text-lg">
                {interaction.subject || "No Subject"}
              </h4>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${config.badge}`}
              >
                {interaction.interaction_type}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {new Date(interaction.interaction_date).toLocaleString()} •
              {interaction.contact_person &&
                ` with ${interaction.contact_person}`}
            </p>
          </div>
        </div>

        {interaction.description && (
          <p className="text-gray-700 mb-3 whitespace-pre-wrap">
            {interaction.description}
          </p>
        )}

        <div className="flex items-center gap-4 text-sm">
          {interaction.outcome && (
            <div className="flex items-center gap-2 text-gray-600">
              <CheckCircle size={16} className="text-green-600" />
              <span>
                <strong>Outcome:</strong> {interaction.outcome}
              </span>
            </div>
          )}
          {interaction.follow_up_required && (
            <div className="flex items-center gap-2 text-orange-600">
              <Calendar size={16} />
              <span>
                <strong>Follow-up:</strong>{" "}
                {interaction.follow_up_date
                  ? new Date(interaction.follow_up_date).toLocaleDateString()
                  : "Needed"}
              </span>
            </div>
          )}
        </div>

        {interaction.created_by && (
          <p className="text-xs text-gray-500 mt-3">
            Logged by {interaction.created_by}
          </p>
        )}
      </div>
    </div>
  );
}

function AddInteractionModal({ clientId, onClose }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    interaction_type: "meeting",
    subject: "",
    description: "",
    contact_person: "",
    outcome: "",
    follow_up_required: false,
    follow_up_date: "",
    created_by: "",
  });

  const addInteractionMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch(`/api/clients/${clientId}/interactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to log interaction");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client", clientId] });
      onClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addInteractionMutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          Log Interaction
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <select
                required
                value={formData.interaction_type}
                onChange={(e) =>
                  setFormData({ ...formData, interaction_type: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="meeting">Meeting</option>
                <option value="call">Phone Call</option>
                <option value="email">Email</option>
                <option value="note">Note</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Person
              </label>
              <input
                type="text"
                value={formData.contact_person}
                onChange={(e) =>
                  setFormData({ ...formData, contact_person: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject *
            </label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Outcome
              </label>
              <input
                type="text"
                value={formData.outcome}
                onChange={(e) =>
                  setFormData({ ...formData, outcome: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logged By
              </label>
              <input
                type="text"
                value={formData.created_by}
                onChange={(e) =>
                  setFormData({ ...formData, created_by: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.follow_up_required}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    follow_up_required: e.target.checked,
                  })
                }
                className="w-5 h-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Follow-up Required
              </span>
            </label>
            {formData.follow_up_required && (
              <input
                type="date"
                value={formData.follow_up_date}
                onChange={(e) =>
                  setFormData({ ...formData, follow_up_date: e.target.value })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            )}
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg transition-all duration-300"
            >
              Log Interaction
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
