"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { desktopApps, quickActions } from "@/utils/dashboardApps";
import { DesktopIcon } from "@/components/Dashboard/DesktopIcon";
import { Taskbar } from "@/components/Dashboard/Taskbar";
import { StartMenu } from "@/components/Dashboard/StartMenu";
import { Window } from "@/components/Dashboard/Window";
import { DefaultWindowContent } from "@/components/Dashboard/DefaultWindowContent";
import { CandidatesWindow } from "@/components/Dashboard/CandidatesWindow/CandidatesWindow";
import { JobsWindow } from "@/components/Dashboard/JobsWindow/JobsWindow";
import { AnalyticsWindow } from "@/components/Dashboard/AnalyticsWindow/AnalyticsWindow";
import { InterviewsWindow } from "@/components/Dashboard/InterviewsWindow/InterviewsWindow";
import { InterviewRoom } from "@/components/Dashboard/InterviewRoom/InterviewRoom";
import { MessagesWindow } from "@/components/Dashboard/MessagesWindow/MessagesWindow";
import { PipelineWindow } from "@/components/Dashboard/PipelineWindow/PipelineWindow";
import { ReportsWindow } from "@/components/Dashboard/ReportsWindow/ReportsWindow";
import { SettingsWindow } from "@/components/Dashboard/SettingsWindow/SettingsWindow";
import { ClientsWindow } from "@/components/Dashboard/ClientsWindow/ClientsWindow";
import { PerformanceWindow } from "@/components/Dashboard/PerformanceWindow/PerformanceWindow";
import { RevenueWindow } from "@/components/Dashboard/RevenueWindow/RevenueWindow";
import { EmailWindow } from "@/components/Dashboard/EmailWindow/EmailWindow";
import { LogOut } from "lucide-react";
import { Chatbot } from "@/components/Dashboard/Chatbot";

const queryClient = new QueryClient();

// Animated Stars Background Component
function Stars() {
  const [stars, setStars] = useState([]);
  const [shootingStars, setShootingStars] = useState([]);

  useEffect(() => {
    // Generate random stars with different behaviors
    const generateStars = () => {
      const starArray = [];
      // Regular floating stars
      for (let i = 0; i < 200; i++) {
        starArray.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 2.5 + 0.5,
          duration: Math.random() * 3 + 2,
          delay: Math.random() * 5,
          opacity: Math.random() * 0.8 + 0.2,
          moveX: Math.random() * 100 - 50,
          moveY: Math.random() * 100 - 50,
          twinkleDuration: Math.random() * 3 + 1,
        });
      }
      setStars(starArray);
    };

    // Generate shooting stars periodically
    const generateShootingStar = () => {
      const newStar = {
        id: Date.now(),
        x: Math.random() * 100,
        y: Math.random() * 30, // Top third of screen
        angle: Math.random() * 30 + 30, // 30-60 degrees
      };
      setShootingStars((prev) => [...prev, newStar]);

      // Remove shooting star after animation
      setTimeout(() => {
        setShootingStars((prev) => prev.filter((s) => s.id !== newStar.id));
      }, 2000);
    };

    generateStars();

    // Create shooting stars every 3-8 seconds
    const shootingInterval = setInterval(
      () => {
        if (Math.random() > 0.3) {
          generateShootingStar();
        }
      },
      3000 + Math.random() * 5000,
    );

    return () => {
      clearInterval(shootingInterval);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Regular animated stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            boxShadow: `0 0 ${star.size * 3}px rgba(255, 255, 255, 0.8), 0 0 ${star.size * 6}px rgba(255, 255, 255, 0.4)`,
            animation: `floatStar ${star.duration}s ease-in-out infinite, twinkle ${star.twinkleDuration}s ease-in-out infinite`,
            animationDelay: `${star.delay}s`,
            "--move-x": `${star.moveX}px`,
            "--move-y": `${star.moveY}px`,
          }}
        />
      ))}

      {/* Shooting stars */}
      {shootingStars.map((star) => (
        <div
          key={star.id}
          className="absolute"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: "3px",
            height: "3px",
            background: "white",
            borderRadius: "50%",
            boxShadow: `0 0 10px 2px rgba(255, 255, 255, 0.8), 0 0 20px 4px rgba(255, 255, 255, 0.4)`,
            animation: "shootingStar 2s ease-out forwards",
            "--angle": `${star.angle}deg`,
          }}
        >
          <div
            className="absolute w-full h-full"
            style={{
              background:
                "linear-gradient(to right, rgba(255,255,255,1), rgba(255,255,255,0))",
              width: "100px",
              height: "2px",
              transform: `rotate(${star.angle}deg)`,
              transformOrigin: "left center",
            }}
          />
        </div>
      ))}
    </div>
  );
}

function DashboardContent() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [openWindows, setOpenWindows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [iconPositions, setIconPositions] = useState({});
  const [draggedIcon, setDraggedIcon] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Windows startup sound
  useEffect(() => {
    if (typeof window !== "undefined") {
      const audio = new Audio(
        "https://www.myinstants.com/media/sounds/windows-xp-startup.mp3",
      );
      audio.volume = 0.3;
      audio
        .play()
        .catch((err) => console.log("Audio autoplay prevented:", err));
    }
  }, []);

  // Check authentication on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      } else {
        window.location.href = "/login";
      }
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  };

  const openApp = (app) => {
    if (!openWindows.find((w) => w.id === app.id)) {
      setOpenWindows([...openWindows, { ...app, minimized: false }]);
    }
    setIsStartMenuOpen(false);
  };

  const closeWindow = (id) => {
    setOpenWindows(openWindows.filter((w) => w.id !== id));
  };

  const minimizeWindow = (id) => {
    setOpenWindows(
      openWindows.map((w) => (w.id === id ? { ...w, minimized: true } : w)),
    );
  };

  const restoreWindow = (id) => {
    setOpenWindows(
      openWindows.map((w) => (w.id === id ? { ...w, minimized: false } : w)),
    );
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleDragStart = (e, appId) => {
    setDraggedIcon(appId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetAppId) => {
    e.preventDefault();
    if (draggedIcon && draggedIcon !== targetAppId) {
      const apps = [...desktopApps];
      const draggedIndex = apps.findIndex((app) => app.id === draggedIcon);
      const targetIndex = apps.findIndex((app) => app.id === targetAppId);

      [apps[draggedIndex], apps[targetIndex]] = [
        apps[targetIndex],
        apps[draggedIndex],
      ];

      setIconPositions({
        ...iconPositions,
        [draggedIcon]: targetIndex,
        [targetAppId]: draggedIndex,
      });
    }
    setDraggedIcon(null);
  };

  const renderWindowContent = (window) => {
    switch (window.id) {
      case "candidates":
        return <CandidatesWindow />;
      case "jobs":
        return <JobsWindow />;
      case "analytics":
        return <AnalyticsWindow />;
      case "interviews":
        return <InterviewsWindow />;
      case "live-interview":
        return <InterviewRoom />;
      case "messages":
        return <MessagesWindow />;
      case "pipeline":
        return <PipelineWindow />;
      case "reports":
        return <ReportsWindow />;
      case "settings":
        return <SettingsWindow />;
      case "clients":
        return <ClientsWindow />;
      case "performance":
        return <PerformanceWindow />;
      case "revenue":
        return <RevenueWindow />;
      case "email":
        return <EmailWindow />;
      default:
        return <DefaultWindowContent window={window} />;
    }
  };

  if (!isAuthenticated) {
    return null; // or a loading spinner
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-black via-slate-950 to-black">
      {/* Animated Stars Background */}
      <Stars />

      {/* User info and logout button */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white text-sm">
          <span className="font-medium">{user?.name || user?.email}</span>
        </div>
        <button
          onClick={handleLogout}
          className="backdrop-blur-md bg-white/10 hover:bg-red-500/20 border border-white/20 hover:border-red-500/50 rounded-xl px-4 py-2 text-white text-sm transition-all duration-300 flex items-center gap-2 group"
        >
          <LogOut
            size={16}
            className="group-hover:scale-110 transition-transform"
          />
          <span>Logout</span>
        </button>
      </div>

      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 h-[calc(100vh-60px)] p-6 overflow-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {desktopApps.map((app, index) => (
            <DesktopIcon
              key={app.id}
              app={app}
              index={index}
              onOpen={openApp}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={(e, targetAppId) =>
                handleDrop(e, targetAppId, desktopApps)
              }
            />
          ))}
        </div>
      </div>

      {openWindows.map(
        (window) =>
          !window.minimized && (
            <Window
              key={window.id}
              window={window}
              onClose={closeWindow}
              onMinimize={minimizeWindow}
            >
              {renderWindowContent(window)}
            </Window>
          ),
      )}

      <Taskbar
        isStartMenuOpen={isStartMenuOpen}
        onStartMenuToggle={() => setIsStartMenuOpen(!isStartMenuOpen)}
        openWindows={openWindows}
        onWindowRestore={restoreWindow}
        onWindowMinimize={minimizeWindow}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currentTime={currentTime}
        formatTime={formatTime}
        formatDate={formatDate}
      />

      {isStartMenuOpen && (
        <StartMenu
          desktopApps={desktopApps}
          quickActions={quickActions}
          onAppOpen={openApp}
        />
      )}

      {/* Add Chatbot */}
      <Chatbot />

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes startMenuOpen {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes windowOpen {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        @keyframes floatStar {
          0%, 100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(var(--move-x), calc(var(--move-y) * 0.5));
          }
          50% {
            transform: translate(calc(var(--move-x) * 0.7), var(--move-y));
          }
          75% {
            transform: translate(calc(var(--move-x) * -0.3), calc(var(--move-y) * 0.8));
          }
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        @keyframes shootingStar {
          0% {
            transform: translateX(0) translateY(0) rotate(var(--angle));
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: translateX(300px) translateY(300px) rotate(var(--angle));
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardContent />
    </QueryClientProvider>
  );
}
