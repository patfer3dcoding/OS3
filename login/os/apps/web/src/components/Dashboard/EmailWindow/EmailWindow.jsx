"use client";

import { useState } from "react";
import { Mail, Send, Users, TrendingUp, BarChart3, Plus } from "lucide-react";

export function EmailWindow() {
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const campaigns = [
    {
      id: 1,
      name: "Q2 Hiring Drive",
      subject: "Exciting Opportunities at Top Tech Companies",
      status: "Active",
      sent: 2500,
      opened: 1850,
      clicked: 450,
      responses: 125,
      date: "2024-06-01",
    },
    {
      id: 2,
      name: "Senior Developer Outreach",
      subject: "Your Next Career Move Awaits",
      status: "Completed",
      sent: 1200,
      opened: 920,
      clicked: 280,
      responses: 78,
      date: "2024-05-15",
    },
    {
      id: 3,
      name: "Healthcare Professionals",
      subject: "Join Leading Healthcare Organizations",
      status: "Active",
      sent: 1800,
      opened: 1450,
      clicked: 380,
      responses: 95,
      date: "2024-06-05",
    },
  ];

  const templates = [
    { id: 1, name: "Job Opportunity", category: "Outreach", uses: 45 },
    { id: 2, name: "Interview Invitation", category: "Scheduling", uses: 38 },
    { id: 3, name: "Follow-up", category: "Engagement", uses: 52 },
    { id: 4, name: "Rejection (Polite)", category: "Closing", uses: 23 },
  ];

  const stats = [
    {
      label: "Total Sent",
      value: "5.5K",
      icon: Send,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Open Rate",
      value: "74%",
      icon: Mail,
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "Click Rate",
      value: "22%",
      icon: TrendingUp,
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Response Rate",
      value: "5.8%",
      icon: BarChart3,
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-50 overflow-auto p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Email Center
            </h2>
            <p className="text-gray-600">
              Manage your recruitment email campaigns
            </p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2">
            <Plus size={20} />
            New Campaign
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-lg p-5 border border-gray-200 transform hover:scale-105 transition-all duration-300"
              >
                <div
                  className={`bg-gradient-to-br ${stat.color} text-white w-12 h-12 rounded-lg flex items-center justify-center mb-3`}
                >
                  <Icon size={24} />
                </div>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Campaigns */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Active Campaigns
            </h3>
            <div className="space-y-3">
              {campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  onClick={() => setSelectedCampaign(campaign)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-md ${
                    selectedCampaign?.id === campaign.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {campaign.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {campaign.subject}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        campaign.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {campaign.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mt-3 text-center">
                    <div>
                      <p className="text-lg font-bold text-blue-600">
                        {campaign.sent}
                      </p>
                      <p className="text-xs text-gray-600">Sent</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-green-600">
                        {Math.round((campaign.opened / campaign.sent) * 100)}%
                      </p>
                      <p className="text-xs text-gray-600">Opened</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-purple-600">
                        {Math.round((campaign.clicked / campaign.sent) * 100)}%
                      </p>
                      <p className="text-xs text-gray-600">Clicked</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-orange-600">
                        {campaign.responses}
                      </p>
                      <p className="text-xs text-gray-600">Replies</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Templates */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Email Templates
            </h3>
            <div className="space-y-3">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white p-2 rounded-lg">
                        <Mail size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {template.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {template.category}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">
                        {template.uses}
                      </p>
                      <p className="text-xs text-gray-600">uses</p>
                    </div>
                  </div>
                </div>
              ))}
              <button className="w-full py-3 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-2">
                <Plus size={20} />
                Create New Template
              </button>
            </div>
          </div>
        </div>

        {/* Campaign Details */}
        {selectedCampaign && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Campaign Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">
                  Campaign Name
                </h4>
                <p className="text-gray-600">{selectedCampaign.name}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">
                  Subject Line
                </h4>
                <p className="text-gray-600">{selectedCampaign.subject}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Sent Date</h4>
                <p className="text-gray-600">{selectedCampaign.date}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Status</h4>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    selectedCampaign.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {selectedCampaign.status}
                </span>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="font-semibold text-gray-700 mb-2">
                Performance Breakdown
              </h4>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Open Rate</span>
                    <span className="text-sm font-medium text-gray-700">
                      {Math.round(
                        (selectedCampaign.opened / selectedCampaign.sent) * 100,
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                      style={{
                        width: `${(selectedCampaign.opened / selectedCampaign.sent) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Click Rate</span>
                    <span className="text-sm font-medium text-gray-700">
                      {Math.round(
                        (selectedCampaign.clicked / selectedCampaign.sent) *
                          100,
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                      style={{
                        width: `${(selectedCampaign.clicked / selectedCampaign.sent) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
