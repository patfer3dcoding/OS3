import {
  Trash2,
  Edit2,
  X,
  Linkedin,
  Github,
  Globe,
  Twitter,
  FileDown,
  Save,
} from "lucide-react";
import { useState } from "react";

const statusColors = {
  new: "bg-blue-500",
  screening: "bg-yellow-500",
  interview: "bg-purple-500",
  offer: "bg-green-500",
  rejected: "bg-red-500",
};

export function CandidateDetails({ candidate, onStatusChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(candidate);

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/candidates/${candidate.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editData,
          skills:
            typeof editData.skills === "string"
              ? editData.skills.split(",").map((s) => s.trim())
              : editData.skills,
        }),
      });

      if (!response.ok) throw new Error("Failed to update candidate");

      const result = await response.json();
      setIsEditing(false);
      // The parent component will handle the refresh via onSuccess mutation
      window.location.reload(); // Simple refresh to show updated data
    } catch (error) {
      console.error("Error updating candidate:", error);
      alert("Failed to update candidate");
    }
  };

  if (isEditing) {
    return (
      <div className="max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Edit Candidate</h2>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white font-medium flex items-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={() => {
                setEditData(candidate);
                setIsEditing(false);
              }}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium flex items-center gap-2 transition-all"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/90 text-sm mb-2">Name</label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                className="w-full h-10 px-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <div>
              <label className="block text-white/90 text-sm mb-2">Email</label>
              <input
                type="email"
                value={editData.email}
                onChange={(e) =>
                  setEditData({ ...editData, email: e.target.value })
                }
                className="w-full h-10 px-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <div>
              <label className="block text-white/90 text-sm mb-2">Phone</label>
              <input
                type="text"
                value={editData.phone || ""}
                onChange={(e) =>
                  setEditData({ ...editData, phone: e.target.value })
                }
                className="w-full h-10 px-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <div>
              <label className="block text-white/90 text-sm mb-2">
                Position
              </label>
              <input
                type="text"
                value={editData.position || ""}
                onChange={(e) =>
                  setEditData({ ...editData, position: e.target.value })
                }
                className="w-full h-10 px-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <div>
              <label className="block text-white/90 text-sm mb-2">
                Location
              </label>
              <input
                type="text"
                value={editData.location || ""}
                onChange={(e) =>
                  setEditData({ ...editData, location: e.target.value })
                }
                className="w-full h-10 px-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <div>
              <label className="block text-white/90 text-sm mb-2">
                Experience (years)
              </label>
              <input
                type="number"
                value={editData.experience_years || ""}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    experience_years: parseInt(e.target.value) || null,
                  })
                }
                className="w-full h-10 px-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <div>
              <label className="block text-white/90 text-sm mb-2">
                Salary Expectation
              </label>
              <input
                type="number"
                value={editData.salary_expectation || ""}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    salary_expectation: parseInt(e.target.value) || null,
                  })
                }
                className="w-full h-10 px-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-white/90 text-sm mb-2">
              Skills (comma-separated)
            </label>
            <input
              type="text"
              value={
                Array.isArray(editData.skills)
                  ? editData.skills.join(", ")
                  : editData.skills
              }
              onChange={(e) =>
                setEditData({ ...editData, skills: e.target.value })
              }
              className="w-full h-10 px-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/90 text-sm mb-2">
                LinkedIn
              </label>
              <input
                type="url"
                value={editData.linkedin_url || ""}
                onChange={(e) =>
                  setEditData({ ...editData, linkedin_url: e.target.value })
                }
                className="w-full h-10 px-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <div>
              <label className="block text-white/90 text-sm mb-2">GitHub</label>
              <input
                type="url"
                value={editData.github_url || ""}
                onChange={(e) =>
                  setEditData({ ...editData, github_url: e.target.value })
                }
                className="w-full h-10 px-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <div>
              <label className="block text-white/90 text-sm mb-2">
                Portfolio
              </label>
              <input
                type="url"
                value={editData.portfolio_url || ""}
                onChange={(e) =>
                  setEditData({ ...editData, portfolio_url: e.target.value })
                }
                className="w-full h-10 px-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <div>
              <label className="block text-white/90 text-sm mb-2">
                Twitter
              </label>
              <input
                type="url"
                value={editData.twitter_url || ""}
                onChange={(e) =>
                  setEditData({ ...editData, twitter_url: e.target.value })
                }
                className="w-full h-10 px-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-white/90 text-sm mb-2">Notes</label>
            <textarea
              value={editData.notes || ""}
              onChange={(e) =>
                setEditData({ ...editData, notes: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4">
          {candidate.photo_url && (
            <img
              src={candidate.photo_url}
              alt={candidate.name}
              className="w-20 h-20 rounded-xl object-cover border-2 border-white/20"
            />
          )}
          <div>
            <h2 className="text-2xl font-bold text-white">{candidate.name}</h2>
            <p className="text-white/70">{candidate.position}</p>

            {/* Social Media Links */}
            <div className="flex gap-2 mt-2">
              {candidate.linkedin_url && (
                <a
                  href={candidate.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-400 transition-all"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {candidate.github_url && (
                <a
                  href={candidate.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-purple-400 transition-all"
                  title="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {candidate.portfolio_url && (
                <a
                  href={candidate.portfolio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-green-400 transition-all"
                  title="Portfolio"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
              {candidate.twitter_url && (
                <a
                  href={candidate.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-sky-500/20 hover:bg-sky-500/30 rounded-lg text-sky-400 transition-all"
                  title="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {candidate.resume_url && (
            <a
              href={candidate.resume_url}
              download
              className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-400 transition-all"
              title="Download CV"
            >
              <FileDown className="w-4 h-4" />
            </a>
          )}
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-400 transition-all"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <select
            value={candidate.status}
            onChange={(e) => onStatusChange(e.target.value)}
            className={`px-3 py-1 rounded-lg text-white text-sm font-medium ${statusColors[candidate.status]}`}
          >
            <option value="new">New</option>
            <option value="screening">Screening</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>
          <button
            onClick={onDelete}
            className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-all"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
            <div className="text-white/60 text-sm mb-1">Email</div>
            <div className="text-white">{candidate.email}</div>
          </div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
            <div className="text-white/60 text-sm mb-1">Phone</div>
            <div className="text-white">{candidate.phone || "N/A"}</div>
          </div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
            <div className="text-white/60 text-sm mb-1">Location</div>
            <div className="text-white">{candidate.location || "N/A"}</div>
          </div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
            <div className="text-white/60 text-sm mb-1">Experience</div>
            <div className="text-white">
              {candidate.experience_years
                ? `${candidate.experience_years} years`
                : "N/A"}
            </div>
          </div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
            <div className="text-white/60 text-sm mb-1">Salary Expectation</div>
            <div className="text-white">
              {candidate.salary_expectation
                ? `$${candidate.salary_expectation.toLocaleString()}`
                : "N/A"}
            </div>
          </div>
        </div>

        {candidate.skills && candidate.skills.length > 0 && (
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
            <div className="text-white/60 text-sm mb-2">Skills</div>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {candidate.notes && (
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
            <div className="text-white/60 text-sm mb-2">Notes</div>
            <div className="text-white/90">{candidate.notes}</div>
          </div>
        )}
      </div>
    </div>
  );
}
