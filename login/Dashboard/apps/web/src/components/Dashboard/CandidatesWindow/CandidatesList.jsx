import { Search, Plus, Upload } from "lucide-react";

const statusColors = {
  new: "bg-blue-500",
  screening: "bg-yellow-500",
  interview: "bg-purple-500",
  offer: "bg-green-500",
  rejected: "bg-red-500",
};

export function CandidatesList({
  candidates,
  isLoading,
  searchQuery,
  statusFilter,
  selectedCandidate,
  onSearchChange,
  onStatusFilterChange,
  onCandidateSelect,
  onAddNew,
  onBulkImport,
}) {
  return (
    <div className="w-80 border-r border-white/10 flex flex-col bg-white/5">
      {/* Search & Filter */}
      <div className="p-4 border-b border-white/10 space-y-3">
        <div className="flex gap-2">
          <button
            onClick={onAddNew}
            className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-sm font-medium transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
          <button
            onClick={onBulkImport}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-white text-sm font-medium transition-all"
            title="Bulk Import"
          >
            <Upload className="w-4 h-4" />
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search candidates..."
            className="w-full h-10 pl-10 pr-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="w-full h-10 px-3 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="screening">Screening</option>
          <option value="interview">Interview</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Candidate List */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="p-4 text-white/50 text-center">Loading...</div>
        ) : candidates.length === 0 ? (
          <div className="p-4 text-white/50 text-center">
            No candidates found
          </div>
        ) : (
          candidates.map((candidate) => (
            <button
              key={candidate.id}
              onClick={() => onCandidateSelect(candidate)}
              className={`w-full p-4 border-b border-white/10 text-left transition-all hover:bg-white/10 ${
                selectedCandidate?.id === candidate.id ? "bg-white/15" : ""
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="font-medium text-white">{candidate.name}</div>
                <span
                  className={`px-2 py-0.5 rounded text-xs text-white ${statusColors[candidate.status]}`}
                >
                  {candidate.status}
                </span>
              </div>
              <div className="text-sm text-white/70">
                {candidate.position || "No position"}
              </div>
              <div className="text-xs text-white/50 mt-1">
                {candidate.email}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
