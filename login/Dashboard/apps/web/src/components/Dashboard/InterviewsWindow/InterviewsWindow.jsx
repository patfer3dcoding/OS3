"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  Clock,
  User,
  Briefcase,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Video,
} from "lucide-react";
import { InterviewRoom } from "../InterviewRoom/InterviewRoom";

export function InterviewsWindow() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [isLiveInterview, setIsLiveInterview] = useState(false);
  const [liveInterviewData, setLiveInterviewData] = useState(null);
  const [formData, setFormData] = useState({
    candidate_id: "",
    job_id: "",
    interview_date: "",
    interview_time: "",
    type: "phone",
    notes: "",
  });

  const { data: interviews = [], isLoading } = useQuery({
    queryKey: ["interviews"],
    queryFn: async () => {
      const res = await fetch("/api/interviews");
      if (!res.ok) throw new Error("Failed to fetch interviews");
      const data = await res.json();
      return data.interviews || [];
    },
  });

  const { data: candidates = [] } = useQuery({
    queryKey: ["candidates"],
    queryFn: async () => {
      const res = await fetch("/api/candidates");
      if (!res.ok) throw new Error("Failed to fetch candidates");
      const data = await res.json();
      return data.candidates || [];
    },
  });

  const { data: jobs = [] } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const res = await fetch("/api/jobs");
      if (!res.ok) throw new Error("Failed to fetch jobs");
      const data = await res.json();
      return data.jobs || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch("/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create interview");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["interviews"]);
      setShowForm(false);
      setFormData({
        candidate_id: "",
        job_id: "",
        interview_date: "",
        interview_time: "",
        type: "phone",
        notes: "",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/interviews/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete interview");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["interviews"]);
      setSelectedInterview(null);
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await fetch(`/api/interviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["interviews"]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const datetime = `${formData.interview_date}T${formData.interview_time}:00`;
    createMutation.mutate({
      candidate_id: parseInt(formData.candidate_id),
      job_id: parseInt(formData.job_id),
      interview_date: datetime,
      type: formData.type,
      notes: formData.notes,
    });
  };

  const startLiveInterview = (interview) => {
    const candidate = candidates.find((c) => c.id === interview.candidate_id);
    if (candidate) {
      setLiveInterviewData({ interview, candidate });
      setIsLiveInterview(true);
    }
  };

  const endLiveInterview = () => {
    setIsLiveInterview(false);
    setLiveInterviewData(null);
  };

  if (isLiveInterview && liveInterviewData) {
    return (
      <InterviewRoom
        interview={liveInterviewData.interview}
        candidate={liveInterviewData.candidate}
        onEnd={endLiveInterview}
      />
    );
  }

  const upcomingInterviews = interviews.filter(
    (i) => new Date(i.interview_date) >= new Date() && i.status === "scheduled",
  );
  const pastInterviews = interviews.filter(
    (i) => new Date(i.interview_date) < new Date() || i.status !== "scheduled",
  );

  return (
    <div className="flex h-full bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Interview Scheduler
            </h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus size={20} />
              Schedule Interview
            </button>
          </div>

          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-green-200"
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                New Interview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Candidate
                  </label>
                  <select
                    required
                    value={formData.candidate_id}
                    onChange={(e) =>
                      setFormData({ ...formData, candidate_id: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select candidate</option>
                    {candidates.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job
                  </label>
                  <select
                    required
                    value={formData.job_id}
                    onChange={(e) =>
                      setFormData({ ...formData, job_id: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select job</option>
                    {jobs.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.interview_date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        interview_date: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.interview_time}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        interview_time: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="phone">Phone</option>
                    <option value="video">Video</option>
                    <option value="in-person">In Person</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Additional notes..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-all duration-300"
                >
                  Schedule
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Upcoming Interviews ({upcomingInterviews.length})
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {upcomingInterviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="bg-white rounded-xl shadow-md p-5 border-l-4 border-green-500 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                          <User size={18} className="text-green-600" />
                          {interview.candidate_name}
                        </h4>
                        <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                          <Briefcase size={16} />
                          {interview.job_title}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        {interview.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar size={16} />
                        {new Date(
                          interview.interview_date,
                        ).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={16} />
                        {new Date(interview.interview_date).toLocaleTimeString(
                          [],
                          { hour: "2-digit", minute: "2-digit" },
                        )}
                      </span>
                    </div>
                    {interview.notes && (
                      <p className="mt-2 text-sm text-gray-500 italic">
                        {interview.notes}
                      </p>
                    )}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => startLiveInterview(interview)}
                        className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg text-xs transition-all font-medium"
                      >
                        <Video size={14} />
                        Start Live Interview
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatusMutation.mutate({
                            id: interview.id,
                            status: "completed",
                          });
                        }}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs transition-all"
                      >
                        <CheckCircle size={14} />
                        Complete
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatusMutation.mutate({
                            id: interview.id,
                            status: "cancelled",
                          });
                        }}
                        className="flex items-center gap-1 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs transition-all"
                      >
                        <XCircle size={14} />
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {upcomingInterviews.length === 0 && (
                <p className="text-gray-500 text-center py-8">
                  No upcoming interviews scheduled
                </p>
              )}
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Past Interviews ({pastInterviews.length})
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {pastInterviews.slice(0, 6).map((interview) => (
                  <div
                    key={interview.id}
                    className="bg-white rounded-xl shadow-md p-5 border-l-4 border-gray-400 opacity-75 hover:opacity-100 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {interview.candidate_name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {interview.job_title}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          interview.status === "completed"
                            ? "bg-blue-100 text-blue-700"
                            : interview.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {interview.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar size={16} />
                        {new Date(
                          interview.interview_date,
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
