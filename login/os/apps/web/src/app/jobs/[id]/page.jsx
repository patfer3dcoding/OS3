"use client";

import { useEffect, useState } from "react";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Building2,
  CheckCircle2,
  Share2,
  ArrowLeft,
  Linkedin,
  Twitter,
  Facebook,
  Link as LinkIcon,
  Mail,
  X,
  Upload,
  FileText,
  Loader2,
} from "lucide-react";
import useUpload from "../../../utils/useUpload";

export default function JobDetailPage({ params }) {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applicationForm, setApplicationForm] = useState({
    name: "",
    email: "",
    phone: "",
    cover_letter: "",
    resume_url: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { upload, uploading } = useUpload();

  const handleCVUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await upload(file);
      setApplicationForm(prev => ({ ...prev, resume_url: url }));
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed");
    }
  };

  const submitApplication = async (e) => {
    e.preventDefault();
    if (!applicationForm.resume_url) {
      alert("Please upload a resume");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_id: job.id,
          ...applicationForm
        }),
      });
      if (!response.ok) throw new Error("Failed to submit");
      alert("Application Submitted Successfully!");
      setShowApplyModal(false);
      setApplicationForm({ name: "", email: "", phone: "", cover_letter: "", resume_url: "" });
    } catch (error) {
      console.error(error);
      alert("Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchJob();
    }
  }, [params.id]);

  const fetchJob = async () => {
    try {
      const response = await fetch(`/api/jobs/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch job");
      const data = await response.json();
      if (data.success) {
        setJob(data.job);
      }
    } catch (error) {
      console.error("Error fetching job:", error);
    } finally {
      setLoading(false);
    }
  };

  const getJobUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return "";
  };

  const shareToLinkedIn = () => {
    const url = encodeURIComponent(getJobUrl());
    const title = encodeURIComponent(job.title);
    const summary = encodeURIComponent(
      job.description?.substring(0, 200) || "Join our team!",
    );
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

  const goBack = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/jobs";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading job details...</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Job not found</h2>
          <button
            onClick={goBack}
            className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-all"
          >
            View All Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        {/* Back Button */}
        <button
          onClick={goBack}
          className="mb-8 flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to all jobs</span>
        </button>

        {/* Job Header */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 mb-8 animate-slideDown">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {job.title}
              </h1>
              {job.department && (
                <div className="flex items-center gap-2 text-xl text-white/70 mb-4">
                  <Building2 className="w-6 h-6" />
                  <span>{job.department}</span>
                </div>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="w-14 h-14 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 rounded-2xl flex items-center justify-center text-purple-300 hover:text-purple-200 transition-all hover:scale-110"
              >
                <Share2 className="w-6 h-6" />
              </button>

              {showShareMenu && (
                <div className="absolute right-0 mt-3 w-64 bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden animate-scaleIn">
                  <div className="p-3 border-b border-white/10">
                    <p className="text-white font-semibold text-sm">
                      Share this job
                    </p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={shareToLinkedIn}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-xl transition-all text-white group"
                    >
                      <Linkedin className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                      <span>Share on LinkedIn</span>
                    </button>
                    <button
                      onClick={shareToTwitter}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-xl transition-all text-white group"
                    >
                      <Twitter className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />
                      <span>Share on Twitter</span>
                    </button>
                    <button
                      onClick={shareToFacebook}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-xl transition-all text-white group"
                    >
                      <Facebook className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
                      <span>Share on Facebook</span>
                    </button>
                    <button
                      onClick={shareViaEmail}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-xl transition-all text-white group"
                    >
                      <Mail className="w-5 h-5 text-green-400 group-hover:scale-110 transition-transform" />
                      <span>Share via Email</span>
                    </button>
                    <div className="h-px bg-white/10 my-2" />
                    <button
                      onClick={copyLink}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-xl transition-all text-white group"
                    >
                      <LinkIcon className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                      <span>{copySuccess ? "Copied!" : "Copy Link"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <span className="px-5 py-3 bg-purple-500/20 border border-purple-500/30 rounded-xl text-purple-300 font-medium capitalize flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              {job.job_type || "full-time"}
            </span>
            {job.location && (
              <span className="px-5 py-3 bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-300 font-medium flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {job.location}
              </span>
            )}
            {(job.salary_min || job.salary_max) && (
              <span className="px-5 py-3 bg-green-500/20 border border-green-500/30 rounded-xl text-green-300 font-medium flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                {job.salary_min && job.salary_max
                  ? `$${(job.salary_min / 1000).toFixed(0)}k - $${(job.salary_max / 1000).toFixed(0)}k`
                  : job.salary_min
                    ? `From $${(job.salary_min / 1000).toFixed(0)}k`
                    : `Up to $${(job.salary_max / 1000).toFixed(0)}k`}
              </span>
            )}
            <span className="px-5 py-3 bg-white/10 border border-white/20 rounded-xl text-white/70 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Posted {new Date(job.created_at).toLocaleDateString()}
            </span>
          </div>

          <button
            onClick={() => setShowApplyModal(true)}
            className="w-full py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold rounded-2xl transition-all hover:scale-105 shadow-lg hover:shadow-purple-500/50 text-lg">
            Apply Now
          </button>
        </div>

        {/* Apply Modal */}
        {showApplyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-slate-900 border border-white/20 rounded-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Apply for {job.title}</h3>
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                <form onSubmit={submitApplication} className="space-y-4">
                  <div>
                    <label className="block text-white/90 text-sm mb-2">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={applicationForm.name}
                      onChange={(e) => setApplicationForm({ ...applicationForm, name: e.target.value })}
                      className="w-full h-10 px-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-white/90 text-sm mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={applicationForm.email}
                      onChange={(e) => setApplicationForm({ ...applicationForm, email: e.target.value })}
                      className="w-full h-10 px-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-white/90 text-sm mb-2">Phone</label>
                    <input
                      type="tel"
                      value={applicationForm.phone}
                      onChange={(e) => setApplicationForm({ ...applicationForm, phone: e.target.value })}
                      className="w-full h-10 px-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-white/90 text-sm mb-2">Resume (PDF/Doc) *</label>
                    <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-blue-500/50 transition-all bg-white/5">
                      {uploading ? (
                        <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                      ) : applicationForm.resume_url ? (
                        <div className="flex items-center gap-2 text-green-400">
                          <FileText className="w-5 h-5" />
                          <span className="text-sm font-medium">Resume Uploaded</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-white/50 mb-2" />
                          <span className="text-xs text-white/50">Click to upload</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleCVUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-white/90 text-sm mb-2">Cover Letter</label>
                    <textarea
                      rows={4}
                      value={applicationForm.cover_letter}
                      onChange={(e) => setApplicationForm({ ...applicationForm, cover_letter: e.target.value })}
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || uploading}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Job Description */}
        {job.description && (
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 mb-8 animate-slideUp">
            <h2 className="text-3xl font-bold text-white mb-6">
              About this role
            </h2>
            <p className="text-white/80 leading-relaxed text-lg whitespace-pre-wrap">
              {job.description}
            </p>
          </div>
        )}

        {/* Requirements */}
        {job.requirements && (
          <div
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 animate-slideUp"
            style={{ animationDelay: "0.1s" }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">Requirements</h2>
            <ul className="space-y-4">
              {(Array.isArray(job.requirements)
                ? job.requirements
                : job.requirements.split(",")
              )
                .map((r) => r.trim())
                .filter(Boolean)
                .map((req, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-4 text-white/80 text-lg"
                    style={{
                      animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
                    }}
                  >
                    <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    <span>{req}</span>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.6s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
