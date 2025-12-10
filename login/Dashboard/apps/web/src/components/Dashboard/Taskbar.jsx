import { Search, Bell, User, Grid3x3 } from "lucide-react";

export function Taskbar({
  isStartMenuOpen,
  onStartMenuToggle,
  openWindows,
  onWindowRestore,
  onWindowMinimize,
  searchQuery,
  onSearchChange,
  currentTime,
  formatTime,
  formatDate,
}) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 h-[60px] backdrop-blur-2xl bg-black/40 border-t border-white/10 shadow-2xl">
      <div className="h-full px-2 flex items-center justify-between">
        {/* Start Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onStartMenuToggle}
            className={`h-[45px] px-4 rounded-xl flex items-center gap-2 transition-all duration-300 ${
              isStartMenuOpen
                ? "bg-white scale-95 shadow-lg"
                : "bg-white hover:bg-gray-100 hover:scale-105 shadow-md"
            }`}
          >
            <img
              src="https://ucarecdn.com/81a5968c-383c-458c-be81-9c216f1509e9/-/format/auto/"
              alt="goodtalent"
              className="h-8 object-contain"
            />
            <Grid3x3 className="w-5 h-5 text-gray-700" />
          </button>

          {/* Open Apps in Taskbar */}
          <div className="flex items-center gap-2 ml-2">
            {openWindows.map((window) => (
              <button
                key={window.id}
                onClick={() =>
                  window.minimized
                    ? onWindowRestore(window.id)
                    : onWindowMinimize(window.id)
                }
                className={`h-[45px] px-4 rounded-xl flex items-center gap-2 transition-all ${
                  window.minimized
                    ? "bg-white/5 hover:bg-white/10"
                    : "bg-white/20"
                }`}
              >
                <window.icon className="w-5 h-5 text-white" />
                <span className="text-white text-sm font-medium hidden md:block">
                  {window.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search apps, candidates, jobs..."
              className="w-full h-[45px] pl-10 pr-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
            />
          </div>
        </div>

        {/* Right - System Tray */}
        <div className="flex items-center gap-3">
          <button className="relative w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
            <Bell className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center">
              5
            </span>
          </button>

          <button className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
            <User className="w-5 h-5 text-white" />
          </button>

          <div className="text-white text-right ml-2">
            <div className="text-sm font-semibold">
              {formatTime(currentTime)}
            </div>
            <div className="text-xs text-white/70">
              {formatDate(currentTime)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
