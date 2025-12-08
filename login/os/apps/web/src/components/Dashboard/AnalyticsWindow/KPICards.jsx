import { Users, Briefcase, Target, TrendingUp } from "lucide-react";

export function KPICards({ totals = {} }) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-8">
      <div className="p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <Users className="w-5 h-5 text-blue-400" />
        </div>
        <div className="text-3xl font-bold text-white">
          {totals.candidates || 0}
        </div>
        <div className="text-sm text-white/70">Total Candidates</div>
      </div>
      <div className="p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <Briefcase className="w-5 h-5 text-purple-400" />
        </div>
        <div className="text-3xl font-bold text-white">{totals.jobs || 0}</div>
        <div className="text-sm text-white/70">Open Positions</div>
      </div>
      <div className="p-4 bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <Target className="w-5 h-5 text-green-400" />
        </div>
        <div className="text-3xl font-bold text-white">
          {totals.applications || 0}
        </div>
        <div className="text-sm text-white/70">Applications</div>
      </div>
      <div className="p-4 bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <TrendingUp className="w-5 h-5 text-orange-400" />
        </div>
        <div className="text-3xl font-bold text-white">
          {totals.hireRate || 0}%
        </div>
        <div className="text-sm text-white/70">Hire Rate</div>
      </div>
    </div>
  );
}
