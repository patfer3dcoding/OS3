"use client";

import { useState } from "react";
import {
  Search,
  Globe,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Plus,
  X,
  Bookmark,
  Link as LinkIcon,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function BrowserWindow() {
  const queryClient = useQueryClient();
  const [url, setUrl] = useState("https://www.google.com");
  const [inputUrl, setInputUrl] = useState("");
  const [tabs, setTabs] = useState([
    { id: 1, title: "New Tab", url: "https://www.google.com" },
  ]);
  const [activeTab, setActiveTab] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkToSave, setLinkToSave] = useState({
    url: "",
    title: "",
    description: "",
  });

  const { data: candidates = [] } = useQuery({
    queryKey: ["candidates"],
    queryFn: async () => {
      const res = await fetch("/api/candidates");
      if (!res.ok) throw new Error("Failed to fetch candidates");
      const data = await res.json();
      return data.candidates || [];
    },
  });

  const updateCandidateMutation = useMutation({
    mutationFn: async ({ id, notes }) => {
      const res = await fetch(`/api/candidates/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      if (!res.ok) throw new Error("Failed to update candidate");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["candidates"]);
      setShowLinkModal(false);
      alert("Link saved to candidate profile!");
    },
  });

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch("/api/browser/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) throw new Error("Search failed");

      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const addTab = () => {
    const newTab = {
      id: Date.now(),
      title: "New Tab",
      url: "https://www.google.com",
    };
    setTabs([...tabs, newTab]);
    setActiveTab(newTab.id);
    setUrl(newTab.url);
  };

  const closeTab = (tabId) => {
    const newTabs = tabs.filter((t) => t.id !== tabId);
    if (newTabs.length === 0) {
      setTabs([
        { id: Date.now(), title: "New Tab", url: "https://www.google.com" },
      ]);
    } else {
      setTabs(newTabs);
      if (activeTab === tabId) {
        setActiveTab(newTabs[0].id);
        setUrl(newTabs[0].url);
      }
    }
  };

  const switchTab = (tabId) => {
    const tab = tabs.find((t) => t.id === tabId);
    if (tab) {
      setActiveTab(tabId);
      setUrl(tab.url);
    }
  };

  const navigateToUrl = (newUrl) => {
    setUrl(newUrl);
    setTabs(
      tabs.map((t) =>
        t.id === activeTab
          ? {
              ...t,
              url: newUrl,
              title: newUrl.replace(/^https?:\/\//, "").split("/")[0],
            }
          : t,
      ),
    );
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    let finalUrl = inputUrl;
    if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
      finalUrl = "https://" + finalUrl;
    }
    navigateToUrl(finalUrl);
    setInputUrl("");
  };

  const openLinkModal = (result) => {
    setLinkToSave({
      url: result.url,
      title: result.title,
      description: result.snippet || "",
    });
    setShowLinkModal(true);
  };

  const saveLinkToCandidate = () => {
    if (!selectedCandidate) {
      alert("Please select a candidate");
      return;
    }

    const candidate = candidates.find(
      (c) => c.id === parseInt(selectedCandidate),
    );
    if (!candidate) return;

    const linkEntry = `\n\n[Link saved from Browser - ${new Date().toLocaleString()}]\nTitle: ${linkToSave.title}\nURL: ${linkToSave.url}\nDescription: ${linkToSave.description}`;

    const updatedNotes = (candidate.notes || "") + linkEntry;

    updateCandidateMutation.mutate({
      id: candidate.id,
      notes: updatedNotes,
    });
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Tabs Bar */}
      <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 border-b border-gray-300">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => switchTab(tab.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-t-lg cursor-pointer group transition-all ${
              activeTab === tab.id
                ? "bg-white border-t-2 border-t-blue-500"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            <Globe size={14} className="text-gray-600" />
            <span className="text-xs max-w-[120px] truncate">{tab.title}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
              className="opacity-0 group-hover:opacity-100 hover:bg-gray-200 rounded-full p-0.5 transition-all"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        <button
          onClick={addTab}
          className="p-1.5 hover:bg-gray-300 rounded-full transition-all"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Address Bar */}
      <div className="flex items-center gap-2 p-2 bg-white border-b border-gray-300">
        <button className="p-2 hover:bg-gray-100 rounded-full transition-all">
          <ArrowLeft size={18} className="text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-all">
          <ArrowRight size={18} className="text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-all">
          <RefreshCw size={18} className="text-gray-600" />
        </button>

        <form onSubmit={handleUrlSubmit} className="flex-1 flex items-center">
          <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 border border-gray-300 focus-within:border-blue-500 focus-within:bg-white transition-all">
            <Globe size={16} className="text-gray-500" />
            <input
              type="text"
              value={inputUrl || url}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Search or enter URL"
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>
        </form>

        <button className="p-2 hover:bg-gray-100 rounded-full transition-all">
          <Bookmark size={18} className="text-gray-600" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto bg-white">
        <div className="max-w-4xl mx-auto p-8">
          {/* Google-style Search */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-red-500 via-yellow-500 to-green-500 rounded-lg flex items-center justify-center">
                <Globe size={28} className="text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-red-600 via-yellow-600 to-green-600 bg-clip-text text-transparent">
                Search
              </h1>
            </div>

            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex items-center gap-3 bg-white rounded-full px-6 py-4 shadow-lg border border-gray-200 hover:shadow-xl transition-all">
                <Search size={20} className="text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search the web with AI..."
                  className="flex-1 outline-none text-lg"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all transform hover:scale-105"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Search Results */}
          {isSearching && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Searching the web...</p>
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="space-y-6">
              <p className="text-sm text-gray-600">
                About {searchResults.length} results
              </p>
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-4 hover:shadow-md transition-all border border-gray-100"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-600 hover:underline flex items-center gap-1"
                      >
                        <Globe size={14} />
                        {result.displayUrl || result.url}
                      </a>
                      <h3 className="text-xl text-blue-700 hover:underline cursor-pointer mt-1 font-medium">
                        {result.title}
                      </h3>
                      <p className="text-sm text-gray-700 mt-2">
                        {result.snippet}
                      </p>
                    </div>
                    <button
                      onClick={() => openLinkModal(result)}
                      className="flex items-center gap-1 px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm transition-all whitespace-nowrap"
                    >
                      <LinkIcon size={14} />
                      Link to Candidate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Links */}
          {!searchQuery && searchResults.length === 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              {[
                {
                  name: "LinkedIn",
                  icon: "💼",
                  color: "from-blue-500 to-blue-700",
                },
                {
                  name: "GitHub",
                  icon: "💻",
                  color: "from-gray-700 to-gray-900",
                },
                {
                  name: "Stack Overflow",
                  icon: "📚",
                  color: "from-orange-500 to-orange-700",
                },
                {
                  name: "Indeed",
                  icon: "🔍",
                  color: "from-blue-600 to-blue-800",
                },
                {
                  name: "Glassdoor",
                  icon: "🏢",
                  color: "from-green-500 to-green-700",
                },
                {
                  name: "AngelList",
                  icon: "🚀",
                  color: "from-purple-500 to-purple-700",
                },
                {
                  name: "Twitter",
                  icon: "🐦",
                  color: "from-sky-400 to-sky-600",
                },
                { name: "Medium", icon: "✍️", color: "from-gray-800 to-black" },
              ].map((link) => (
                <button
                  key={link.name}
                  onClick={() => setSearchQuery(link.name)}
                  className={`bg-gradient-to-br ${link.color} text-white rounded-xl p-6 hover:shadow-lg transition-all transform hover:scale-105 flex flex-col items-center gap-2`}
                >
                  <span className="text-3xl">{link.icon}</span>
                  <span className="font-medium">{link.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Link to Candidate Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Link to Candidate Profile
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link Details
                </label>
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  <p className="font-medium text-gray-800">
                    {linkToSave.title}
                  </p>
                  <p className="text-gray-600 text-xs mt-1 truncate">
                    {linkToSave.url}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Candidate
                </label>
                <select
                  value={selectedCandidate || ""}
                  onChange={(e) => setSelectedCandidate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Choose a candidate...</option>
                  {candidates.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} - {c.position || "No position"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={saveLinkToCandidate}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg hover:shadow-lg transition-all transform hover:scale-105"
                >
                  Save to Profile
                </button>
                <button
                  onClick={() => setShowLinkModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
