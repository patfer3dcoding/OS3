"use client";

import { useState, useRef, useEffect } from "react";
import useAuth from "../../utils/useAuth";
import { Mail, Lock, Volume2, VolumeX } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const playerRef = useRef(null);
  const { signInWithCredentials } = useAuth();

  useEffect(() => {
    // Load YouTube IFrame API
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // Create YouTube player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player("youtube-player", {
        videoId: "jvQ6dasK614",
        playerVars: {
          autoplay: 0,
          controls: 0,
          loop: 1,
          playlist: "jvQ6dasK614", // Required for looping
          start: 9, // Start at 0:09
        },
        events: {
          onReady: (event) => {
            // Player is ready
          },
        },
      });
    };
  }, []);

  const startAudio = () => {
    if (playerRef.current && playerRef.current.playVideo) {
      playerRef.current.playVideo();
    }
    setAudioStarted(true);
  };

  const toggleMute = () => {
    if (playerRef.current) {
      if (isMuted) {
        playerRef.current.unMute();
      } else {
        playerRef.current.mute();
      }
      setIsMuted(!isMuted);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithCredentials({
        email,
        password,
        callbackUrl: "/dashboard",
        redirect: true,
      });
    } catch (err) {
      setError("Invalid email or password");
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      {/* Hidden YouTube Player for Audio */}
      <div className="fixed top-0 left-0 w-0 h-0 opacity-0 pointer-events-none">
        <div id="youtube-player"></div>
      </div>

      {/* Click to Enter Overlay */}
      {!audioStarted && (
        <div
          onClick={startAudio}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center cursor-pointer"
        >
          <div className="text-center">
            <div className="mb-8">
              <Volume2
                className="w-20 h-20 mx-auto text-cyan-400 animate-pulse"
                style={{
                  filter: "drop-shadow(0 0 30px rgba(6, 182, 212, 0.8))",
                }}
              />
            </div>
            <h1
              className="text-6xl font-black text-white mb-4"
              style={{
                textShadow: "0 0 40px rgba(6, 182, 212, 0.6)",
              }}
            >
              Click to Enter
            </h1>
            <p
              className="text-xl text-cyan-400 font-semibold"
              style={{
                textShadow: "0 0 20px rgba(6, 182, 212, 0.4)",
              }}
            >
              Experience awaits with sound
            </p>
          </div>
        </div>
      )}

      {/* Mute/Unmute Button */}
      {audioStarted && (
        <button
          onClick={toggleMute}
          className="fixed top-4 right-4 z-40 w-12 h-12 bg-black/40 backdrop-blur-sm border-2 border-cyan-400/60 rounded-full flex items-center justify-center hover:bg-black/60 transition-all duration-300"
          style={{
            boxShadow: "0 0 20px rgba(6, 182, 212, 0.3)",
          }}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-cyan-400" />
          ) : (
            <Volume2 className="w-5 h-5 text-cyan-400" />
          )}
        </button>
      )}

      {/* Animated GIF Background - Full Screen */}
      <div
        className="absolute inset-0 bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://ucarecdn.com/462216f3-bc7a-4b7c-bc30-7e13943985f9/')",
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}
      />

      {/* Light overlay for text contrast */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md px-3 sm:px-4 max-h-screen overflow-y-auto">
        {/* Logo - Image */}
        <div className="text-center py-2">
          <img
            src="https://ucarecdn.com/c04e8246-623e-46c6-9ecd-8129523aa66a/-/format/auto/"
            alt="goodtalent logo"
            className="mx-auto"
            style={{
              filter:
                "drop-shadow(0 0 30px rgba(255, 20, 147, 0.5)) brightness(1.2)",
              transform: "scale(2)",
              transformOrigin: "center",
              maxWidth: "none",
              width: "250px",
            }}
          />
        </div>

        {/* Login Card - Completely Transparent */}
        <div className="bg-transparent rounded-3xl p-3 sm:p-4">
          {/* Header */}
          <div className="text-center mb-3">
            <h2
              className="text-3xl sm:text-4xl font-black text-white mb-2"
              style={{
                textShadow: `
                  0 0 20px rgba(0, 0, 0, 0.8),
                  0 4px 12px rgba(0, 0, 0, 0.6),
                  0 8px 24px rgba(0, 0, 0, 0.4)
                `,
              }}
            >
              Welcome Back
            </h2>
            <p
              className="text-gray-200 text-sm sm:text-base font-semibold"
              style={{
                textShadow: `
                  0 2px 8px rgba(0, 0, 0, 0.8),
                  0 4px 16px rgba(0, 0, 0, 0.6)
                `,
              }}
            >
              Sign in to continue to your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Email Field */}
            <div>
              <label
                className="block text-white text-sm font-bold mb-1.5"
                style={{
                  textShadow: `
                    0 2px 8px rgba(0, 0, 0, 0.9),
                    0 4px 16px rgba(0, 0, 0, 0.7)
                  `,
                }}
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full h-12 pl-12 pr-12 bg-black/40 backdrop-blur-sm border-2 border-cyan-400/60 rounded-xl text-white text-sm font-semibold placeholder-gray-300 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all duration-300"
                  style={{
                    boxShadow:
                      "0 0 20px rgba(6, 182, 212, 0.3), 0 4px 12px rgba(0, 0, 0, 0.5)",
                  }}
                />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400/70 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                className="block text-white text-sm font-bold mb-1.5"
                style={{
                  textShadow: `
                    0 2px 8px rgba(0, 0, 0, 0.9),
                    0 4px 16px rgba(0, 0, 0, 0.7)
                  `,
                }}
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSubmit(e)}
                  placeholder="Enter your password"
                  className="w-full h-12 pl-12 pr-12 bg-black/40 backdrop-blur-sm border-2 border-cyan-400/60 rounded-xl text-white text-sm font-semibold placeholder-gray-300 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all duration-300"
                  style={{
                    boxShadow:
                      "0 0 20px rgba(6, 182, 212, 0.3), 0 4px 12px rgba(0, 0, 0, 0.5)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-400/70 hover:text-cyan-400 transition-colors drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                >
                  <Lock className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/30 backdrop-blur-sm border-2 border-red-400/60 rounded-xl p-3">
                <p
                  className="text-red-100 text-center text-sm font-bold"
                  style={{
                    textShadow: "0 2px 4px rgba(0, 0, 0, 0.8)",
                  }}
                >
                  {error}
                </p>
              </div>
            )}

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white text-base font-black rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] mt-4"
              style={{
                boxShadow:
                  "0 0 40px rgba(6, 182, 212, 0.5), 0 4px 16px rgba(0, 0, 0, 0.4)",
                textShadow: "0 2px 8px rgba(0, 0, 0, 0.6)",
              }}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-4">
            <p
              className="text-gray-200 text-sm font-semibold"
              style={{
                textShadow: `
                  0 2px 8px rgba(0, 0, 0, 0.9),
                  0 4px 16px rgba(0, 0, 0, 0.7)
                `,
              }}
            >
              Don't have an account?{" "}
              <a
                href="/account/signup"
                className="text-cyan-400 hover:text-cyan-300 font-black transition-colors"
                style={{
                  textShadow: `
                    0 0 10px rgba(6, 182, 212, 0.6),
                    0 2px 8px rgba(0, 0, 0, 0.9)
                  `,
                }}
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
