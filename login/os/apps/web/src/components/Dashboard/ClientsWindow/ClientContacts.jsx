import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, User, Mail, Phone, Star, Trash2 } from "lucide-react";

export function ClientContacts({ contacts, clientId }) {
  const [showAddContact, setShowAddContact] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800">Contact Persons</h3>
        <button
          onClick={() => setShowAddContact(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <Plus size={20} />
          Add Contact
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contacts.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-gray-500">
            No contacts added
          </div>
        ) : (
          contacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              clientId={clientId}
            />
          ))
        )}
      </div>

      {showAddContact && (
        <AddContactModal
          clientId={clientId}
          onClose={() => setShowAddContact(false)}
        />
      )}
    </div>
  );
}

function ContactCard({ contact, clientId }) {
  const queryClient = useQueryClient();

  const deleteContactMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `/api/clients/${clientId}/contacts?contactId=${contact.id}`,
        {
          method: "DELETE",
        },
      );
      if (!response.ok) throw new Error("Failed to delete contact");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client", clientId] });
    },
  });

  return (
    <div
      className={`bg-white rounded-xl shadow-lg p-6 border-2 ${contact.is_primary ? "border-teal-500 bg-teal-50/30" : "border-gray-200"} hover:shadow-xl transition-all`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white p-3 rounded-lg">
            <User size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-800 text-lg">
                {contact.name}
              </h4>
              {contact.is_primary && (
                <span className="bg-teal-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Star size={12} />
                  Primary
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">
              {contact.title || "No title"}
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            if (confirm("Delete this contact?")) {
              deleteContactMutation.mutate();
            }
          }}
          className="text-red-600 hover:text-red-700 transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="space-y-2">
        {contact.email && (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Mail size={16} className="text-gray-400" />
            <a
              href={`mailto:${contact.email}`}
              className="hover:text-teal-600 transition-colors"
            >
              {contact.email}
            </a>
          </div>
        )}
        {contact.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Phone size={16} className="text-gray-400" />
            <a
              href={`tel:${contact.phone}`}
              className="hover:text-teal-600 transition-colors"
            >
              {contact.phone}
            </a>
          </div>
        )}
      </div>

      {contact.notes && (
        <p className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          {contact.notes}
        </p>
      )}
    </div>
  );
}

function AddContactModal({ clientId, onClose }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    email: "",
    phone: "",
    is_primary: false,
    notes: "",
  });

  const addContactMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch(`/api/clients/${clientId}/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to add contact");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client", clientId] });
      onClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addContactMutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          Add Contact Person
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
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
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_primary}
              onChange={(e) =>
                setFormData({ ...formData, is_primary: e.target.checked })
              }
              className="w-5 h-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Set as Primary Contact
            </span>
          </label>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg transition-all duration-300"
            >
              Add Contact
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
