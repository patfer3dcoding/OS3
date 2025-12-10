import { X, Minimize2, Maximize2, Minimize } from "lucide-react";
import { useState } from "react";

export function Window({ window, onClose, onMinimize, children }) {
  const [isMaximized, setIsMaximized] = useState(false);

  return (
    <div
      className={`absolute z-20 ${
        isMaximized
          ? "top-0 left-0 w-full h-[calc(100vh-60px)]"
          : "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-6xl h-[85vh]"
      }`}
      style={{
        animation: "windowOpen 0.3s ease-out",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <div className="w-full h-full backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Window Header */}
        <div
          className={`flex items-center justify-between px-4 py-3 bg-gradient-to-r ${window.color} text-white`}
        >
          <div className="flex items-center gap-3">
            <window.icon className="w-5 h-5" />
            <span className="font-semibold">{window.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center transition-all"
              title={isMaximized ? "Restore" : "Maximize"}
            >
              {isMaximized ? (
                <Minimize className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => onMinimize(window.id)}
              className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center transition-all"
              title="Minimize"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onClose(window.id)}
              className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center transition-all"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Window Content */}
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
