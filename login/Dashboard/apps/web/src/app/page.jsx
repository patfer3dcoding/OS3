"use client";

import { useEffect } from "react";

export default function HomePage() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");

      if (token) {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/login";
      }
    }
  }, []);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="text-white text-xl animate-pulse">Loading...</div>
    </div>
  );
}
