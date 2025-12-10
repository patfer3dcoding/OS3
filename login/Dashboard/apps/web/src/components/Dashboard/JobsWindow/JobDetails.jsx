import {
  Trash2,
  Pencil,
  Share2,
  ExternalLink,
  Linkedin,
  Twitter,
  Facebook,
  Mail,
  Link as LinkIcon,
  MapPin,
  DollarSign,
  Briefcase,
} from "lucide-react";
import { useState } from "react";

export function JobDetails({ job, onDelete, onEdit }) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  if (!job) {
    return (
      <div className="flex-1 flex items-center justify-center text-white/50">
        Select a job to view details
      </div>
    );
  }

  const getJobUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/jobs/${job.id}`;
    }
    return "";
  };

  const shareToLinkedIn = () => {
    const url = encodeURIComponent(getJobUrl());
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      "_blank",
    );
  };

  const shareToTwitter = () => {
    const url = encodeURIComponent(getJobUrl());
    const text = encodeURIComponent(
      `Check out this job opportunity: ${job.title} at ${job.department || "our company"}`,
    );
    window.open(
      `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      "_blank",
    );
  };

  const shareToFacebook = () => {
    const url = encodeURIComponent(getJobUrl());
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      "_blank",
    );
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Job Opportunity: ${job.title}`);
    const body = encodeURIComponent(
      `I found this job opportunity that might interest you:\n\n${job.title}\n${job.department ? `Department: ${job.department}\n` : ""}${job.location ? `Location: ${job.location}\n` : ""}\n\nView details: ${getJobUrl()}`,
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(getJobUrl());
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const openPublicPage = () => {
    window.open(getJobUrl(), "_blank");
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white mb-1">{job.title}</h2>
          <p className="text-white/70">
            {job.department} • {job.location}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={openPublicPage}
            className="px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded-lg text-blue-300 hover:text-blue-200 transition-all flex items-center gap-2 text-sm"
            title="View public job page"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">Public Page</span>
          </button>
          <div className="relative">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="w-9 h-9 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 rounded-lg flex items-center justify-center text-purple-300 hover:text-purple-200 transition-all"
              title="Share job"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {showShareMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden z-50 animate-scaleIn">
                <div className="p-2 border-b border-white/10">
                  <p className="text-white font-medium text-xs">
                    Share this job
                  </p>
                </div>
                <div className="p-1">
                  <button
                    onClick={shareToLinkedIn}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded-lg transition-all text-white text-sm"
                  >
                    <Linkedin className="w-4 h-4 text-blue-400" />
                    <span>LinkedIn</span>
                  </button>
                  <button
                    onClick={shareToTwitter}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded-lg transition-all text-white text-sm"
                  >
                    <Twitter className="w-4 h-4 text-sky-400" />
                    <span>Twitter</span>
                  </button>
                  <button
                    onClick={shareToFacebook}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded-lg transition-all text-white text-sm"
                  >
                    <Facebook className="w-4 h-4 text-blue-500" />
                    <span>Facebook</span>
                  </button>
                  <button
                    onClick={shareViaEmail}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded-lg transition-all text-white text-sm"
                  >
                    <Mail className="w-4 h-4 text-green-400" />
                    <span>Email</span>
                  </button>
                  <div className="h-px bg-white/10 my-1" />
                  <button
                    onClick={copyLink}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded-lg transition-all text-white text-sm"
                  >
                    <LinkIcon className="w-4 h-4 text-purple-400" />
                    <span>{copySuccess ? "✓ Copied!" : "Copy Link"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          {onEdit && (
            <button
              onClick={onEdit}
              className="w-9 h-9 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded-lg flex items-center justify-center text-blue-300 hover:text-blue-200 transition-all"
              title="Edit job"
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onDelete}
            className="w-9 h-9 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg flex items-center justify-center text-red-400 transition-all"
            title="Delete job"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-purple-500/20 rounded-lg text-purple-300 text-sm flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5" />
            {job.job_type}
          </span>
          <span
            className={`px-3 py-1 rounded-lg text-sm ${job.status === "open" ? "bg-green-500/20 text-green-300" : "bg-gray-500/20 text-gray-300"}`}
          >
            {job.status}
          </span>
          {job.salary_min && job.salary_max && (
            <span className="px-3 py-1 bg-blue-500/20 rounded-lg text-blue-300 text-sm flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5" />$
              {job.salary_min.toLocaleString()} - $
              {job.salary_max.toLocaleString()}
            </span>
          )}
          {job.location && (
            <span className="px-3 py-1 bg-teal-500/20 rounded-lg text-teal-300 text-sm flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {job.location}
            </span>
          )}
        </div>

        <div className="p-4 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl">
          <div className="text-purple-300 text-xs font-semibold mb-2 flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            PUBLIC JOB LINK
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={getJobUrl()}
              readOnly
              className="flex-1 px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-white/80 text-sm font-mono"
            />
            <button
              onClick={copyLink}
              className="px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 rounded-lg text-purple-300 transition-all text-sm font-medium"
            >
              {copySuccess ? "✓ Copied" : "Copy"}
            </button>
          </div>
        </div>

        {job.description && (
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
            <div className="text-white/60 text-sm mb-2">Description</div>
            <div className="text-white/90">{job.description}</div>
          </div>
        )}

        {job.requirements && job.requirements.length > 0 && (
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
            <div className="text-white/60 text-sm mb-3">Requirements</div>
            <ul className="space-y-2">
              {job.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2 text-white/90">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-scaleIn {
          animation: scaleIn 0.15s ease-out;
        }
      `}</style>
    </div>
  );
}
