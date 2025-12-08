"use client";

import { useEffect } from "react";

export default function HomePage() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      let token = localStorage.getItem("authToken");

      if (!token) {
        // Auto-login logic
        const mockUser = { name: "Neo", email: "neo@matrix.com" };
        token = "mock-token-" + Date.now();
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(mockUser));
      }

      window.location.href = "/dashboard";
    }
  }, []);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="text-white text-xl animate-pulse">Loading...</div>
    </div>
  );
}
