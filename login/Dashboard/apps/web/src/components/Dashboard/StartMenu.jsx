import { Search, Power, Settings, User } from "lucide-react";
import { useState } from "react";

export function StartMenu({ desktopApps, quickActions, onAppOpen }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredApps = desktopApps.filter((app) =>
    app.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="fixed bottom-16 sm:bottom-20 left-2 sm:left-4 md:left-6 z-50 w-[calc(100vw-1rem)] sm:w-[500px] md:w-[600px] max-h-[calc(100vh-6rem)] sm:max-h-[calc(100vh-8rem)] overflow-hidden bg-gradient-to-br from-slate-900/95 to-slate-950/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl animate-startMenuOpen">
      {/* Search Bar */}
      <div className="p-4 md:p-6 border-b border-white/10">
        <div className="relative">
          <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-white/40" />
          <input
            type="text"
            placeholder="Search apps..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 md:h-12 pl-10 md:pl-12 pr-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm md:text-base"
          />
        </div>
      </div>

      {/* Apps Grid */}
      <div className="p-3 md:p-6 max-h-[calc(100vh-24rem)] sm:max-h-[calc(100vh-26rem)] overflow-y-auto">
        <h3 className="text-white/60 text-xs md:text-sm font-medium mb-3 md:mb-4 uppercase tracking-wider">
          All Apps
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-4">
          {filteredApps.map((app) => (
            <button
              key={app.id}
              onClick={() => onAppOpen(app)}
              className="group p-2 md:p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex flex-col items-center gap-2 md:gap-3"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <app.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <span className="text-white text-xs md:text-sm font-medium text-center line-clamp-2">
                {app.name}
              </span>
            </button>
          ))}
        </div>

        {filteredApps.length === 0 && (
          <div className="text-center py-6 md:py-8 text-white/40 text-sm md:text-base">
            No apps found matching "{searchTerm}"
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="p-3 md:p-6 border-t border-white/10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3">
          {quickActions.map((action) => (
            <button
              key={action.id}
              className="flex items-center gap-2 md:gap-3 p-2 md:p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all group"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <action.icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <span className="text-white text-xs md:text-sm font-medium hidden sm:block">
                {action.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* User Section */}
      <div className="p-3 md:p-6 border-t border-white/10 bg-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-9 h-9 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <p className="text-white text-xs sm:text-sm md:text-base font-medium">
                User
              </p>
              <p className="text-white/60 text-[10px] sm:text-xs">
                Administrator
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="w-8 h-8 md:w-10 md:h-10 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg flex items-center justify-center transition-all group">
              <Settings className="w-4 h-4 md:w-5 md:h-5 text-white/70 group-hover:text-white group-hover:rotate-90 transition-all duration-300" />
            </button>
            <button className="w-8 h-8 md:w-10 md:h-10 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg flex items-center justify-center transition-all group">
              <Power className="w-4 h-4 md:w-5 md:h-5 text-red-400 group-hover:text-red-300 transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
