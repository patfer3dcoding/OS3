"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Plus,
  Search,
  Star,
  Users,
  DollarSign,
  Briefcase,
  FileText,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Calendar,
  Filter,
  Download,
} from "lucide-react";
import { ClientOverview } from "./ClientOverview";
import { ClientPlacements } from "./ClientPlacements";
import { ClientPayments } from "./ClientPayments";
import { ClientInteractions } from "./ClientInteractions";
import { ClientContacts } from "./ClientContacts";
import { exportToCSV } from "@/utils/exportUtils";

export function ClientsWindow() {
  const queryClient = useQueryClient();
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddClient, setShowAddClient] = useState(false);
  const [showAddPlacement, setShowAddPlacement] = useState(false);

  // Fetch clients
  const { data: clientsData, isLoading } = useQuery({
    queryKey: ["clients", searchQuery, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (statusFilter) params.append("status", statusFilter);

      const response = await fetch(`/api/clients?${params}`);
      if (!response.ok) throw new Error("Failed to fetch clients");
      return response.json();
    },
  });

  // Fetch selected client details
  const { data: clientDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ["client", selectedClient?.id],
    queryFn: async () => {
      const response = await fetch(`/api/clients/${selectedClient.id}`);
      if (!response.ok) throw new Error("Failed to fetch client details");
      return response.json();
    },
    enabled: !!selectedClient,
  });

  const clients = clientsData?.clients || [];
  const filteredClients = clients;

  // Render different tabs
  const renderTabContent = () => {
    if (!clientDetails) return null;

    switch (activeTab) {
      case "overview":
        return <ClientOverview client={clientDetails.client} />;
      case "placements":
        return (
          <ClientPlacements
            clientId={selectedClient.id}
            placements={clientDetails.placements || []}
            onAddPlacement={() => setShowAddPlacement(true)}
          />
        );
      case "payments":
        return (
          <ClientPayments
            payments={clientDetails.payments || []}
            clientId={selectedClient.id}
          />
        );
      case "interactions":
        return (
          <ClientInteractions
            interactions={clientDetails.interactions || []}
            clientId={selectedClient.id}
          />
        );
      case "contacts":
        return (
          <ClientContacts
            contacts={clientDetails.contacts || []}
            clientId={selectedClient.id}
          />
        );
      default:
        return null;
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Building2 },
    { id: "placements", label: "Placements", icon: Users },
    { id: "payments", label: "Payments", icon: DollarSign },
    { id: "interactions", label: "Interactions", icon: MessageSquare },
    { id: "contacts", label: "Contacts", icon: Phone },
  ];

  return (
    <div className="flex h-full bg-gradient-to-br from-teal-50 to-cyan-50">
      {/* Client List sidebar */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Clients</h3>
            <div className="flex gap-2">
              <button
                onClick={() => exportToCSV(filteredClients, "clients")}
                className="bg-teal-500 hover:bg-teal-600 text-white p-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                title="Export CSV"
              >
                <Download size={20} />
              </button>
              <button
                onClick={() => setShowAddClient(true)}
                className="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="space-y-3">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Client List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : filteredClients.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No clients found
            </div>
          ) : (
            filteredClients.map((client) => (
              <ClientListItem
                key={client.id}
                client={client}
                isSelected={selectedClient?.id === client.id}
                onClick={() => {
                  setSelectedClient(client);
                  setActiveTab("overview");
                }}
              />
            ))
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {selectedClient && clientDetails ? (
          <>
            {/* Client Header */}
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-6 border-b">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                    <Building2 size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {clientDetails.client.company_name}
                    </h2>
                    <p className="text-teal-100 mt-1">
                      {clientDetails.client.industry}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <span className="bg-white/20 px-3 py-1 rounded-full">
                        {clientDetails.client.status}
                      </span>
                      <span className="bg-white/20 px-3 py-1 rounded-full">
                        {clientDetails.client.priority} priority
                      </span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={
                              i < (clientDetails.client.rating || 0)
                                ? "fill-yellow-300 text-yellow-300"
                                : "text-white/40"
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex gap-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold">
                      $
                      {parseFloat(
                        clientDetails.client.total_revenue || 0,
                      ).toLocaleString()}
                    </p>
                    <p className="text-teal-100 text-sm">Total Revenue</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold">
                      {clientDetails.client.total_placements || 0}
                    </p>
                    <p className="text-teal-100 text-sm">Placements</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold">
                      {clientDetails.placements?.filter(
                        (p) => p.status === "pending",
                      ).length || 0}
                    </p>
                    <p className="text-teal-100 text-sm">Pending</p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 mt-6 border-b border-white/20">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-t-lg transition-all duration-300 ${activeTab === tab.id
                          ? "bg-white text-teal-600 font-semibold"
                          : "text-white hover:bg-white/10"
                        }`}
                    >
                      <Icon size={18} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-auto">
              {isLoadingDetails ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-gray-500">Loading details...</div>
                </div>
              ) : (
                renderTabContent()
              )}
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Building2 size={64} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">Select a client to view details</p>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddClient && (
        <AddClientModal onClose={() => setShowAddClient(false)} />
      )}
      {showAddPlacement && selectedClient && (
        <AddPlacementModal
          clientId={selectedClient.id}
          onClose={() => setShowAddPlacement(false)}
        />
      )}
    </div>
  );
}

// Sub-components would go here - I'll create them as separate components next
function ClientListItem({ client, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`p-4 border-b border-gray-200 cursor-pointer transition-all duration-300 hover:bg-teal-50 ${isSelected ? "bg-teal-100 border-l-4 border-l-teal-600" : ""
        }`}
    >
      <div className="flex items-start gap-3">
        <div className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white p-3 rounded-lg flex-shrink-0">
          <Building2 size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-800 truncate">
            {client.company_name}
          </h4>
          <p className="text-sm text-gray-600 truncate">{client.industry}</p>
          <div className="flex items-center gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={
                  i < (client.rating || 0)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
          </div>
          <div className="flex gap-3 mt-2 text-xs text-gray-500">
            <span>
              ${parseFloat(client.total_revenue || 0).toLocaleString()}
            </span>
            <span>{client.total_placements || 0} placements</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add Client Modal and Add Placement Modal components go here - will implement next
function AddClientModal({ onClose }) {
  return <div>Will implement comprehensive add client form</div>;
}

function AddPlacementModal({ clientId, onClose }) {
  return <div>Will implement add placement form</div>;
}
