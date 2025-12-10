"use client";

import { useEffect, useState } from "react";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Building2,
  Search,
  ArrowRight,
} from "lucide-react";

export default function JobsListingPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterLocation, setFilterLocation] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch("/api/jobs");
      if (!response.ok) throw new Error("Failed to fetch jobs");
      const data = await response.json();
      if (data.success) {
        setJobs(data.jobs.filter((job) => job.status === "open"));
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || job.job_type === filterType;
    const matchesLocation =
      !filterLocation ||
      job.location?.toLowerCase().includes(filterLocation.toLowerCase());
    return matchesSearch && matchesType && matchesLocation;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading opportunities...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-slideDown">
          <h1 className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Join Our Team
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Discover exciting opportunities and take your career to the next
            level
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-12 space-y-4 animate-slideUp">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <input
                type="text"
                placeholder="Search jobs, departments, skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-12 pr-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="h-14 px-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            >
              <option value="all" className="bg-slate-900">
                All Types
              </option>
              <option value="full-time" className="bg-slate-900">
                Full-time
              </option>
              <option value="part-time" className="bg-slate-900">
                Part-time
              </option>
              <option value="contract" className="bg-slate-900">
                Contract
              </option>
              <option value="remote" className="bg-slate-900">
                Remote
              </option>
            </select>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <input
                type="text"
                placeholder="Location..."
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="h-14 pl-12 pr-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Jobs Count */}
        <div className="mb-6 text-white/70 text-lg">
          {filteredJobs.length}{" "}
          {filteredJobs.length === 1 ? "position" : "positions"} available
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredJobs.map((job, index) => (
            <a
              key={job.id}
              href={`/jobs/${job.id}`}
              className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:bg-white/15 hover:border-purple-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer block"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
              }}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                    {job.title}
                  </h3>
                  {job.department && (
                    <div className="flex items-center gap-2 text-white/70 mb-3">
                      <Building2 className="w-4 h-4" />
                      <span>{job.department}</span>
                    </div>
                  )}
                </div>
                <ArrowRight className="w-6 h-6 text-purple-400 group-hover:translate-x-2 transition-transform duration-300" />
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-xl text-purple-300 text-sm font-medium capitalize">
                  {job.job_type || "full-time"}
                </span>
                {job.location && (
                  <span className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-300 text-sm font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </span>
                )}
                {(job.salary_min || job.salary_max) && (
                  <span className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-xl text-green-300 text-sm font-medium flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    {job.salary_min && job.salary_max
                      ? `$${(job.salary_min / 1000).toFixed(0)}k - $${(job.salary_max / 1000).toFixed(0)}k`
                      : job.salary_min
                        ? `From $${(job.salary_min / 1000).toFixed(0)}k`
                        : `Up to $${(job.salary_max / 1000).toFixed(0)}k`}
                  </span>
                )}
              </div>

              {job.description && (
                <p className="text-white/70 line-clamp-3 mb-4 leading-relaxed">
                  {job.description}
                </p>
              )}

              <div className="flex items-center gap-2 text-white/50 text-sm">
                <Clock className="w-4 h-4" />
                <span>
                  Posted {new Date(job.created_at).toLocaleDateString()}
                </span>
              </div>
            </a>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-20">
            <Briefcase className="w-20 h-20 text-white/30 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-2">
              No positions found
            </h3>
            <p className="text-white/70">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.8s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.8s ease-out 0.2s both;
        }
      `}</style>
    </div>
  );
}
