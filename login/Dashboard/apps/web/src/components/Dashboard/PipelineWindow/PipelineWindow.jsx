"use client";

import { useQuery } from "@tanstack/react-query";
import { User, Briefcase } from "lucide-react";

const stages = [
  { id: "new", name: "New", color: "bg-blue-500" },
  { id: "screening", name: "Screening", color: "bg-yellow-500" },
  { id: "interview", name: "Interview", color: "bg-purple-500" },
  { id: "offer", name: "Offer", color: "bg-green-500" },
  { id: "hired", name: "Hired", color: "bg-emerald-600" },
  { id: "rejected", name: "Rejected", color: "bg-red-500" },
];

export function PipelineWindow() {
  const { data: candidates = [], isLoading } = useQuery({
    queryKey: ["candidates"],
    queryFn: async () => {
      const res = await fetch("/api/candidates");
      if (!res.ok) throw new Error("Failed to fetch candidates");
      const data = await res.json();
      return data.candidates || [];
    },
  });

  const getCandidatesByStage = (stage) => {
    return candidates.filter((c) => c.status === stage);
  };

  return (
    <div className="h-full bg-gradient-to-br from-rose-50 to-pink-50 overflow-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Recruitment Pipeline
        </h2>
        <p className="text-gray-600">
          Track candidates through your hiring process
        </p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const stageCandidates = getCandidatesByStage(stage.id);
          return (
            <div key={stage.id} className="flex-shrink-0 w-80">
              <div
                className={`${stage.color} text-white rounded-t-xl px-4 py-3 shadow-lg`}
              >
                <h3 className="font-semibold text-lg">{stage.name}</h3>
                <p className="text-sm opacity-90">
                  {stageCandidates.length} candidate
                  {stageCandidates.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="bg-white rounded-b-xl shadow-lg min-h-[500px] max-h-[600px] overflow-y-auto">
                <div className="p-3 space-y-3">
                  {stageCandidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300 transform hover:scale-105 cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`${stage.color} text-white p-2 rounded-lg`}
                        >
                          <User size={20} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">
                            {candidate.name}
                          </h4>
                          <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                            <Briefcase size={14} />
                            {candidate.position || "N/A"}
                          </p>
                          {candidate.experience_years && (
                            <p className="text-xs text-gray-500 mt-1">
                              {candidate.experience_years} years exp
                            </p>
                          )}
                          {candidate.skills && candidate.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {candidate.skills
                                .slice(0, 3)
                                .map((skill, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                                  >
                                    {skill}
                                  </span>
                                ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {stageCandidates.length === 0 && (
                    <p className="text-gray-400 text-center py-8 text-sm">
                      No candidates in this stage
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
