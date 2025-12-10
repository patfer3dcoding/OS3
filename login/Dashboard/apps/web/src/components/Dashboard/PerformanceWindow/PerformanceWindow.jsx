"use client";

import { TrendingUp, Target, Award, Users, Calendar } from "lucide-react";

export function PerformanceWindow() {
  const teamMembers = [
    {
      id: 1,
      name: "Alice Johnson",
      role: "Senior Recruiter",
      placements: 24,
      interviews: 156,
      conversionRate: 15.4,
    },
    {
      id: 2,
      name: "Bob Smith",
      role: "Recruiter",
      placements: 18,
      interviews: 128,
      conversionRate: 14.1,
    },
    {
      id: 3,
      name: "Carol Williams",
      role: "Technical Recruiter",
      placements: 21,
      interviews: 145,
      conversionRate: 14.5,
    },
    {
      id: 4,
      name: "David Brown",
      role: "Recruiter",
      placements: 16,
      interviews: 112,
      conversionRate: 14.3,
    },
  ];

  const metrics = [
    {
      label: "Team Placements",
      value: "79",
      change: "+12%",
      icon: Award,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Total Interviews",
      value: "541",
      change: "+8%",
      icon: Users,
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Avg Conversion",
      value: "14.6%",
      change: "+2.1%",
      icon: Target,
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "Active This Month",
      value: "4",
      change: "100%",
      icon: TrendingUp,
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="h-full bg-gradient-to-br from-violet-50 to-purple-50 overflow-auto p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Team Performance
          </h2>
          <p className="text-gray-600">
            Track your recruiting team's success metrics
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {metrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-lg p-5 border border-gray-200 transform hover:scale-105 transition-all duration-300"
              >
                <div
                  className={`bg-gradient-to-br ${metric.color} text-white w-12 h-12 rounded-lg flex items-center justify-center mb-3`}
                >
                  <Icon size={24} />
                </div>
                <p className="text-3xl font-bold text-gray-800">
                  {metric.value}
                </p>
                <p className="text-sm text-gray-600">{metric.label}</p>
                <p className="text-xs text-green-600 font-medium mt-1">
                  {metric.change} vs last month
                </p>
              </div>
            );
          })}
        </div>

        {/* Team Leaderboard */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Team Leaderboard
            </h3>
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-gray-600" />
              <span className="text-sm text-gray-600">This Quarter</span>
            </div>
          </div>

          <div className="space-y-3">
            {teamMembers.map((member, idx) => (
              <div
                key={member.id}
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg border border-violet-200 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 text-white rounded-full font-bold text-lg">
                  #{idx + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{member.name}</h4>
                  <p className="text-sm text-gray-600">{member.role}</p>
                </div>
                <div className="text-right">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-2xl font-bold text-violet-600">
                        {member.placements}
                      </p>
                      <p className="text-xs text-gray-600">Placements</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-600">
                        {member.interviews}
                      </p>
                      <p className="text-xs text-gray-600">Interviews</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-pink-600">
                        {member.conversionRate}%
                      </p>
                      <p className="text-xs text-gray-600">Conversion</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Goals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Monthly Goals
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Placements Goal
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    79 / 100
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full"
                    style={{ width: "79%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Interview Goal
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    541 / 600
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full"
                    style={{ width: "90%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Conversion Rate Target
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    14.6% / 15%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                    style={{ width: "97%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Top Achievements
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <Award className="text-yellow-600" size={24} />
                <div>
                  <p className="font-semibold text-gray-800">
                    Best Month Ever!
                  </p>
                  <p className="text-sm text-gray-600">
                    Highest placements in company history
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <TrendingUp className="text-green-600" size={24} />
                <div>
                  <p className="font-semibold text-gray-800">Growth Streak</p>
                  <p className="text-sm text-gray-600">
                    3 months of consistent growth
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <Users className="text-blue-600" size={24} />
                <div>
                  <p className="font-semibold text-gray-800">Team Excellence</p>
                  <p className="text-sm text-gray-600">
                    All members exceeded targets
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
