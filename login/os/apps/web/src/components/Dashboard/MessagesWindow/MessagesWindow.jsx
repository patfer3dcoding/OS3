"use client";

import { useState } from "react";
import { MessageSquare, Send, Inbox, Star, Trash2, Search } from "lucide-react";

const mockMessages = [
  {
    id: 1,
    from: "Sarah Johnson",
    subject: "Re: Software Engineer Position",
    preview:
      "Thank you for considering my application. I'm very excited about...",
    time: "10:30 AM",
    unread: true,
    starred: false,
  },
  {
    id: 2,
    from: "Tech Corp HR",
    subject: "Interview Scheduled - Senior Developer",
    preview: "We're pleased to inform you that we've scheduled an interview...",
    time: "9:15 AM",
    unread: true,
    starred: true,
  },
  {
    id: 3,
    from: "Michael Chen",
    subject: "Application Follow-up",
    preview: "I wanted to follow up on my application submitted last week...",
    time: "Yesterday",
    unread: false,
    starred: false,
  },
  {
    id: 4,
    from: "Recruitment Team",
    subject: "New Job Posting - React Developer",
    preview: "We have a new exciting opportunity that matches your profile...",
    time: "Yesterday",
    unread: false,
    starred: false,
  },
  {
    id: 5,
    from: "Emma Davis",
    subject: "Thank You - Interview",
    preview:
      "I wanted to express my gratitude for the opportunity to interview...",
    time: "2 days ago",
    unread: false,
    starred: true,
  },
];

export function MessagesWindow() {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [messages, setMessages] = useState(mockMessages);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFolder, setActiveFolder] = useState("inbox");

  const folders = [
    {
      id: "inbox",
      name: "Inbox",
      icon: Inbox,
      count: messages.filter((m) => m.unread).length,
    },
    {
      id: "starred",
      name: "Starred",
      icon: Star,
      count: messages.filter((m) => m.starred).length,
    },
    { id: "sent", name: "Sent", icon: Send, count: 0 },
    { id: "trash", name: "Trash", icon: Trash2, count: 0 },
  ];

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder =
      activeFolder === "inbox" || (activeFolder === "starred" && msg.starred);
    return matchesSearch && matchesFolder;
  });

  const toggleStar = (id) => {
    setMessages(
      messages.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m)),
    );
  };

  return (
    <div className="flex h-full bg-gradient-to-br from-orange-50 to-red-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg mb-4 flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
          <Send size={18} />
          Compose
        </button>

        <div className="space-y-1">
          {folders.map((folder) => {
            const Icon = folder.icon;
            return (
              <button
                key={folder.id}
                onClick={() => setActiveFolder(folder.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-300 ${
                  activeFolder === folder.id
                    ? "bg-orange-100 text-orange-700"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} />
                  <span className="font-medium">{folder.name}</span>
                </div>
                {folder.count > 0 && (
                  <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded-full">
                    {folder.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Message List */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              onClick={() => setSelectedMessage(message)}
              className={`p-4 border-b border-gray-200 cursor-pointer transition-all duration-300 hover:bg-orange-50 ${
                selectedMessage?.id === message.id ? "bg-orange-100" : ""
              } ${message.unread ? "bg-blue-50" : ""}`}
            >
              <div className="flex items-start justify-between mb-1">
                <h4
                  className={`font-semibold ${message.unread ? "text-gray-900" : "text-gray-700"}`}
                >
                  {message.from}
                </h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{message.time}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStar(message.id);
                    }}
                    className="hover:scale-110 transition-transform"
                  >
                    <Star
                      size={16}
                      className={
                        message.starred
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-400"
                      }
                    />
                  </button>
                </div>
              </div>
              <p
                className={`text-sm mb-1 ${message.unread ? "font-medium text-gray-800" : "text-gray-600"}`}
              >
                {message.subject}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {message.preview}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Message Content */}
      <div className="flex-1 bg-white">
        {selectedMessage ? (
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {selectedMessage.subject}
              </h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 font-medium">
                    {selectedMessage.from}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedMessage.time}
                  </p>
                </div>
                <button
                  onClick={() => toggleStar(selectedMessage.id)}
                  className="hover:scale-110 transition-transform"
                >
                  <Star
                    size={24}
                    className={
                      selectedMessage.starred
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-400"
                    }
                  />
                </button>
              </div>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              <p className="text-gray-700 leading-relaxed">
                {selectedMessage.preview}
                <br />
                <br />
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                <br />
                <br />
                Best regards,
                <br />
                {selectedMessage.from}
              </p>
            </div>
            <div className="p-6 border-t border-gray-200">
              <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-all duration-300 flex items-center gap-2">
                <Send size={18} />
                Reply
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <MessageSquare size={64} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">Select a message to read</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
