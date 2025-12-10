import { Search, Plus } from "lucide-react";

export function JobsList({
  jobs,
  isLoading,
  searchQuery,
  selectedJob,
  onSearchChange,
  onJobSelect,
  onAddNew,
}) {
  return (
    <div className="w-80 border-r border-white/10 flex flex-col bg-white/5">
      <div className="p-4 border-b border-white/10 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search jobs..."
            className="w-full h-10 pl-10 pr-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>
        <button
          onClick={onAddNew}
          className="w-full h-10 bg-purple-500 hover:bg-purple-600 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          Post New Job
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="p-4 text-white/50 text-center">Loading...</div>
        ) : jobs.length === 0 ? (
          <div className="p-4 text-white/50 text-center">No jobs found</div>
        ) : (
          jobs.map((job) => (
            <button
              key={job.id}
              onClick={() => onJobSelect(job)}
              className={`w-full p-4 border-b border-white/10 text-left transition-all hover:bg-white/10 ${
                selectedJob?.id === job.id ? "bg-white/15" : ""
              }`}
            >
              <div className="font-medium text-white mb-1">{job.title}</div>
              <div className="text-sm text-white/70">{job.department}</div>
              <div className="text-xs text-white/50 mt-1">{job.location}</div>
              <div className="flex gap-2 mt-2">
                <span className="px-2 py-0.5 bg-purple-500/20 rounded text-xs text-purple-300">
                  {job.job_type}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-xs ${job.status === "open" ? "bg-green-500/20 text-green-300" : "bg-gray-500/20 text-gray-300"}`}
                >
                  {job.status}
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
