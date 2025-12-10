import { useState, useEffect, useRef } from "react";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  MessageSquare,
  User,
  Brain,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Phone,
  Minimize2,
  Maximize2,
} from "lucide-react";

export function InterviewRoom({ interview, candidate, onEnd }) {
  // Add default values for candidate if undefined
  const candidateData = candidate || {
    name: "Demo Candidate",
    position: "Software Engineer",
    experience_years: 5,
    location: "Remote",
    skills: ["JavaScript", "React", "Node.js"],
    photo_url: null,
    resume_url: null,
  };

  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [transcript, setTranscript] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [candidateAnalysis, setCandidateAnalysis] = useState(null);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [interviewDuration, setInterviewDuration] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const transcriptEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setInterviewDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  // Speech Recognition Setup
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;

        if (event.results[current].isFinal) {
          const newEntry = {
            id: Date.now(),
            speaker: "interviewer",
            text: transcriptText,
            timestamp: new Date().toLocaleTimeString(),
          };
          setTranscript((prev) => [...prev, newEntry]);
          handleGetAISuggestions(transcriptText);
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startRecording = () => {
    if (recognitionRef.current && !isRecording) {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleGetAISuggestions = async (lastMessage) => {
    try {
      const response = await fetch("/api/interviews/ai-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidate: candidateData,
          transcript: [...transcript, { text: lastMessage }],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error("Error getting AI suggestions:", error);
    }
  };

  const analyzeCandidateResponse = async (response) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/interviews/analyze-candidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidate: candidateData,
          response,
          context: transcript,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCandidateAnalysis(data.analysis);
      }
    } catch (error) {
      console.error("Error analyzing candidate:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addCandidateResponse = () => {
    if (!currentMessage.trim()) return;

    const newEntry = {
      id: Date.now(),
      speaker: "candidate",
      text: currentMessage,
      timestamp: new Date().toLocaleTimeString(),
    };
    setTranscript((prev) => [...prev, newEntry]);
    analyzeCandidateResponse(currentMessage);
    setCurrentMessage("");
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 to-slate-950">
      {/* Header */}
      <div className="bg-white/5 border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-white font-semibold">LIVE INTERVIEW</span>
          </div>
          <div className="text-white/60 text-sm">
            Duration: {formatDuration(interviewDuration)}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`p-3 rounded-lg transition-all ${
              isVideoOn
                ? "bg-white/10 hover:bg-white/20 text-white"
                : "bg-red-500/20 hover:bg-red-500/30 text-red-400"
            }`}
          >
            {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
          </button>
          <button
            onClick={() => {
              setIsAudioOn(!isAudioOn);
              if (!isAudioOn) {
                startRecording();
              } else {
                stopRecording();
              }
            }}
            className={`p-3 rounded-lg transition-all ${
              isAudioOn
                ? "bg-white/10 hover:bg-white/20 text-white"
                : "bg-red-500/20 hover:bg-red-500/30 text-red-400"
            }`}
          >
            {isAudioOn ? <Mic size={20} /> : <MicOff size={20} />}
          </button>
          <button
            onClick={onEnd}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg text-white font-medium transition-all flex items-center gap-2"
          >
            <Phone size={20} />
            End Interview
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Candidate Info */}
        <div className="w-80 bg-white/5 border-r border-white/10 overflow-y-auto p-4 space-y-4">
          <div className="text-white font-semibold mb-4 flex items-center gap-2">
            <User size={20} />
            Candidate Profile
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            {candidateData.photo_url ? (
              <img
                src={candidateData.photo_url}
                alt={candidateData.name}
                className="w-24 h-24 rounded-full mx-auto mb-3 object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-3">
                <User className="w-12 h-12 text-white" />
              </div>
            )}
            <h3 className="text-white font-semibold text-center text-lg">
              {candidateData.name}
            </h3>
            <p className="text-white/60 text-center text-sm mb-3">
              {candidateData.position}
            </p>
          </div>

          <div className="space-y-3">
            <div className="bg-white/5 border border-white/10 rounded-lg p-3">
              <div className="text-white/60 text-xs mb-1">Experience</div>
              <div className="text-white font-medium">
                {candidateData.experience_years} years
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-3">
              <div className="text-white/60 text-xs mb-1">Location</div>
              <div className="text-white font-medium">
                {candidateData.location || "N/A"}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-3">
              <div className="text-white/60 text-xs mb-1">Skills</div>
              <div className="flex flex-wrap gap-1 mt-2">
                {candidateData.skills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {candidateData.resume_url && (
              <a
                href={candidateData.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-sm font-medium text-center transition-all"
              >
                View Resume
              </a>
            )}
          </div>
        </div>

        {/* Center - Video & Transcript */}
        <div className="flex-1 flex flex-col">
          {/* Video Area */}
          <div className="h-2/5 bg-black relative">
            <div className="absolute inset-0 flex items-center justify-center">
              {isVideoOn ? (
                <div className="text-white/50 text-center">
                  <Video size={48} className="mx-auto mb-2" />
                  <p>Camera Feed</p>
                  <p className="text-sm">(Simulated)</p>
                </div>
              ) : (
                <div className="text-white/30 text-center">
                  <VideoOff size={48} className="mx-auto mb-2" />
                  <p>Camera Off</p>
                </div>
              )}
            </div>

            {/* Candidate Video (Picture-in-Picture) */}
            <div className="absolute bottom-4 right-4 w-48 h-36 bg-slate-800 rounded-lg border-2 border-white/20 overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
                {candidateData.photo_url ? (
                  <img
                    src={candidateData.photo_url}
                    alt={candidateData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={32} className="text-white/50" />
                )}
              </div>
            </div>
          </div>

          {/* Transcript */}
          <div className="flex-1 bg-white/5 p-4 overflow-y-auto">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare size={20} className="text-white" />
              <h3 className="text-white font-semibold">Live Transcript</h3>
              {isRecording && (
                <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded">
                  Recording...
                </span>
              )}
            </div>

            <div className="space-y-3">
              {transcript.map((entry) => (
                <div
                  key={entry.id}
                  className={`p-3 rounded-lg ${
                    entry.speaker === "interviewer"
                      ? "bg-blue-500/20 border border-blue-500/30"
                      : "bg-purple-500/20 border border-purple-500/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-semibold ${
                        entry.speaker === "interviewer"
                          ? "text-blue-400"
                          : "text-purple-400"
                      }`}
                    >
                      {entry.speaker === "interviewer"
                        ? "You"
                        : candidateData.name}
                    </span>
                    <span className="text-white/50 text-xs">
                      {entry.timestamp}
                    </span>
                  </div>
                  <p className="text-white text-sm">{entry.text}</p>
                </div>
              ))}
              <div ref={transcriptEndRef} />
            </div>

            {/* Manual Input for Candidate Response */}
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addCandidateResponse()}
                placeholder="Simulate candidate response..."
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
              <button
                onClick={addCandidateResponse}
                className="px-6 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-white font-medium transition-all"
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar - AI Analysis */}
        <div className="w-96 bg-white/5 border-l border-white/10 overflow-y-auto p-4 space-y-4">
          <div className="text-white font-semibold mb-4 flex items-center gap-2">
            <Brain size={20} className="text-purple-400" />
            AI Assistant
          </div>

          {/* AI Suggestions */}
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-4">
            <h4 className="text-blue-400 font-semibold mb-3 text-sm flex items-center gap-2">
              <MessageSquare size={16} />
              Suggested Questions
            </h4>
            <div className="space-y-2">
              {aiSuggestions.length > 0 ? (
                aiSuggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white/10 border border-white/10 rounded-lg text-white text-sm cursor-pointer hover:bg-white/20 transition-all"
                    onClick={() => {
                      const newEntry = {
                        id: Date.now(),
                        speaker: "interviewer",
                        text: suggestion,
                        timestamp: new Date().toLocaleTimeString(),
                      };
                      setTranscript((prev) => [...prev, newEntry]);
                    }}
                  >
                    {suggestion}
                  </div>
                ))
              ) : (
                <p className="text-white/50 text-sm">
                  AI suggestions will appear as the conversation progresses...
                </p>
              )}
            </div>
          </div>

          {/* Candidate Analysis */}
          {candidateAnalysis && (
            <div className="space-y-3">
              <h4 className="text-purple-400 font-semibold text-sm flex items-center gap-2">
                <Brain size={16} />
                Real-time Analysis
              </h4>

              {/* Credibility Score */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/70 text-sm">
                    Credibility Score
                  </span>
                  <span
                    className={`font-bold ${
                      candidateAnalysis.credibilityScore >= 70
                        ? "text-green-400"
                        : candidateAnalysis.credibilityScore >= 40
                          ? "text-yellow-400"
                          : "text-red-400"
                    }`}
                  >
                    {candidateAnalysis.credibilityScore}%
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      candidateAnalysis.credibilityScore >= 70
                        ? "bg-green-500"
                        : candidateAnalysis.credibilityScore >= 40
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                    style={{
                      width: `${candidateAnalysis.credibilityScore}%`,
                    }}
                  />
                </div>
              </div>

              {/* Answer Quality */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="text-white/70 text-sm mb-2">Answer Quality</div>
                <div className="flex items-center gap-2">
                  {candidateAnalysis.answerQuality === "strong" ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : candidateAnalysis.answerQuality === "moderate" ? (
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                  <span className="text-white font-medium capitalize">
                    {candidateAnalysis.answerQuality}
                  </span>
                </div>
              </div>

              {/* Red Flags */}
              {candidateAnalysis.redFlags &&
                candidateAnalysis.redFlags.length > 0 && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span className="text-red-400 font-semibold text-sm">
                        Red Flags Detected
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {candidateAnalysis.redFlags.map((flag, idx) => (
                        <li key={idx} className="text-red-300 text-xs">
                          • {flag}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* Insights */}
              {candidateAnalysis.insights && (
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="text-white/70 text-sm mb-2">AI Insights</div>
                  <p className="text-white text-sm">
                    {candidateAnalysis.insights}
                  </p>
                </div>
              )}
            </div>
          )}

          {isAnalyzing && (
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
              <div className="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-2" />
              <p className="text-white/70 text-sm">Analyzing response...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
