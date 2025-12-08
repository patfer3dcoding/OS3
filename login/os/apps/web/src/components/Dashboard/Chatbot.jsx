import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Paperclip,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import useUpload from "@/utils/useUpload";

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm your recruiting assistant. Ask me anything about candidates, jobs, interviews, or how to use the system! You can also upload images for me to analyze.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const { upload, uploading } = useUpload();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await upload(file);
      setUploadedImage(url);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !uploadedImage) || isLoading) return;

    const userMessage = {
      role: "user",
      content: input || "What's in this image?",
      image: uploadedImage,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    const imageToSend = uploadedImage;
    setUploadedImage(null);
    setIsLoading(true);

    try {
      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
        image: msg.image,
      }));

      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input || "What's in this image?",
          conversationHistory,
          image: imageToSend,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Failed to get response: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.reply) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `❌ Sorry, I encountered an error: ${error.message}. Please try again.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => {
          setIsOpen(true);
          setIsFullscreen(false);
        }}
        className="fixed bottom-32 right-6 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-all z-50 group"
      >
        <MessageCircle className="w-7 h-7" />
        <div className="absolute -top-12 right-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-3 py-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Ask me anything!
        </div>
      </button>
    );
  }

  return (
    <div
      className={`fixed z-50 bg-gradient-to-br from-slate-900/95 to-slate-950/95 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col transition-all duration-300 ${isFullscreen
          ? "inset-0 rounded-none"
          : "bottom-0 right-0 sm:bottom-4 sm:right-4 w-full h-full sm:w-[600px] sm:h-[min(750px,calc(100vh-2rem))] rounded-none sm:rounded-2xl"
        }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 md:p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-base md:text-lg">
              AI Assistant
            </h3>
            <p className="text-xs text-white/60">Online • Ready to help</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-all text-white/70 hover:text-white"
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5" />
            ) : (
              <Maximize2 className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/10 rounded-lg transition-all text-white/70 hover:text-white"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 md:px-5 py-3 ${msg.role === "user"
                  ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
                  : "bg-white/10 border border-white/20 text-white"
                }`}
            >
              {msg.image && (
                <img
                  src={msg.image}
                  alt="Uploaded"
                  className="rounded-lg mb-3 max-w-full h-auto max-h-64 object-contain"
                />
              )}
              <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">
                {msg.content}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/10 border border-white/20 rounded-2xl px-5 py-3">
              <Loader2 className="w-5 h-5 text-white/70 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Image Preview */}
      {uploadedImage && (
        <div className="px-4 md:px-5 pb-2">
          <div className="relative inline-block">
            <img
              src={uploadedImage}
              alt="Preview"
              className="h-16 md:h-20 rounded-lg border border-white/20"
            />
            <button
              onClick={() => setUploadedImage(null)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center hover:bg-red-600 transition-all"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 md:p-5 border-t border-white/10">
        <div className="flex gap-2 md:gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || isLoading}
            className="w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl flex items-center justify-center text-white/70 hover:text-white transition-all disabled:opacity-50"
            title="Upload image"
          >
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Paperclip className="w-5 h-5" />
            )}
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask me anything or upload an image..."
            className="flex-1 h-10 md:h-12 px-4 md:px-5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm md:text-base"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || (!input.trim() && !uploadedImage)}
            className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
