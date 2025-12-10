import {
  Mail,
  Phone,
  MapPin,
  Building2,
  DollarSign,
  Calendar,
  FileText,
  Edit2,
} from "lucide-react";

export function ClientOverview({ client }) {
  return (
    <div className="p-6 space-y-6">
      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard
          icon={Mail}
          title="Primary Contact"
          value={client.contact_name || "No contact"}
          subtitle={client.contact_title}
          color="from-blue-500 to-cyan-500"
        />
        <InfoCard
          icon={Phone}
          title="Phone"
          value={client.contact_phone || "No phone"}
          subtitle={client.contact_email}
          color="from-purple-500 to-pink-500"
        />
        <InfoCard
          icon={MapPin}
          title="Location"
          value={`${client.city || ""}, ${client.state || ""}`}
          subtitle={client.address}
          color="from-green-500 to-emerald-500"
        />
        <InfoCard
          icon={Building2}
          title="Company Size"
          value={client.company_size || "Not specified"}
          subtitle={client.website}
          color="from-orange-500 to-red-500"
        />
      </div>

      {/* Commission Structure */}
      <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <DollarSign className="text-teal-600" size={20} />
          Commission Structure
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Type</p>
            <p className="text-lg font-semibold text-gray-800 capitalize">
              {client.commission_type || "Not set"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Rate/Fee</p>
            <p className="text-lg font-semibold text-gray-800">
              {client.commission_type === "percentage" && client.commission_rate
                ? `${client.commission_rate}%`
                : client.commission_flat_fee
                  ? `$${parseFloat(client.commission_flat_fee).toLocaleString()}`
                  : "Not set"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Payment Terms</p>
            <p className="text-lg font-semibold text-gray-800">
              {client.payment_terms || "Not specified"}
            </p>
          </div>
        </div>
      </div>

      {/* Contract Information */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FileText className="text-teal-600" size={20} />
          Contract Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                client.contract_status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {client.contract_status || "No contract"}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600">Start Date</p>
            <p className="text-lg font-semibold text-gray-800">
              {client.contract_start_date
                ? new Date(client.contract_start_date).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">End Date</p>
            <p className="text-lg font-semibold text-gray-800">
              {client.contract_end_date
                ? new Date(client.contract_end_date).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Notes */}
      {client.notes && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Notes</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{client.notes}</p>
        </div>
      )}

      {/* Tags */}
      {client.tags && client.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {client.tags.map((tag, idx) => (
            <span
              key={idx}
              className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function InfoCard({ icon: Icon, title, value, subtitle, color }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-200 hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <div className={`bg-gradient-to-br ${color} text-white p-2 rounded-lg`}>
          <Icon size={20} />
        </div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>
      <p className="text-gray-900 font-medium">{value}</p>
      {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
    </div>
  );
}
