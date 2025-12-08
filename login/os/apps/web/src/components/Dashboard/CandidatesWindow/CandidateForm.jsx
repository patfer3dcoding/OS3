import { Upload, FileText, Loader2 } from "lucide-react";
import { useState } from "react";
import useUpload from "@/utils/useUpload";

export function CandidateForm({
  formData,
  onFormDataChange,
  onSubmit,
  onCancel,
  isSubmitting,
}) {
  const { upload, uploading } = useUpload();
  const [parsingCV, setParsingCV] = useState(false);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await upload(file);
      onFormDataChange({ ...formData, photo_url: url });
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert("Failed to upload photo");
    }
  };

  const handleCVUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setParsingCV(true);

      // Upload the CV file first
      const cvUrl = await upload(file);

      // Read the file content
      const text = await file.text();

      // Parse with AI
      const response = await fetch("/api/candidates/parse-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText: text }),
      });

      if (!response.ok) throw new Error("Failed to parse CV");

      const result = await response.json();
      const parsed = result.data;

      // Update form with parsed data
      onFormDataChange({
        ...formData,
        resume_url: cvUrl,
        name: parsed.name || formData.name,
        email: parsed.email || formData.email,
        phone: parsed.phone || formData.phone,
        position: parsed.position || formData.position,
        experience_years: parsed.experience_years || formData.experience_years,
        skills: parsed.skills ? parsed.skills.join(", ") : formData.skills,
        location: parsed.location || formData.location,
        salary_expectation:
          parsed.salary_expectation || formData.salary_expectation,
        linkedin_url: parsed.linkedin_url || formData.linkedin_url,
        github_url: parsed.github_url || formData.github_url,
        portfolio_url: parsed.portfolio_url || formData.portfolio_url,
        twitter_url: parsed.twitter_url || formData.twitter_url,
        notes: parsed.notes || formData.notes,
      });
    } catch (error) {
      console.error("Error parsing CV:", error);
      alert("Failed to parse CV. You can still fill the form manually.");
    } finally {
      setParsingCV(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-bold text-white mb-6">Add New Candidate</h2>
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Photo and CV Upload Section */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white/90 text-sm mb-2">Photo</label>
            <div className="relative">
              {formData.photo_url ? (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-white/20">
                  <img
                    src={formData.photo_url}
                    alt="Candidate"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      onFormDataChange({ ...formData, photo_url: "" })
                    }
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-blue-500/50 transition-all">
                  <Upload className="w-6 h-6 text-white/50 mb-2" />
                  <span className="text-xs text-white/50">Upload Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              )}
            </div>
          </div>

          <div>
            <label className="block text-white/90 text-sm mb-2">
              Upload CV/Resume
            </label>
            <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-blue-500/50 transition-all">
              {parsingCV ? (
                <>
                  <Loader2 className="w-6 h-6 text-blue-400 mb-2 animate-spin" />
                  <span className="text-xs text-white/70">Parsing CV...</span>
                </>
              ) : (
                <>
                  <FileText className="w-6 h-6 text-white/50 mb-2" />
                  <span className="text-xs text-white/50 text-center px-2">
                    {formData.resume_url
                      ? "CV Uploaded ✓"
                      : "Upload CV to auto-fill"}
                  </span>
                </>
              )}
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleCVUpload}
                className="hidden"
                disabled={parsingCV || uploading}
              />
            </label>
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white/90 text-sm mb-2">Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                onFormDataChange({ ...formData, name: e.target.value })
              }
              className="w-full h-10 px-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div>
            <label className="block text-white/90 text-sm mb-2">Email *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                onFormDataChange({ ...formData, email: e.target.value })
              }
              className="w-full h-10 px-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div>
            <label className="block text-white/90 text-sm mb-2">Phone</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) =>
                onFormDataChange({ ...formData, phone: e.target.value })
              }
              className="w-full h-10 px-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div>
            <label className="block text-white/90 text-sm mb-2">Position</label>
            <input
              type="text"
              value={formData.position}
              onChange={(e) =>
                onFormDataChange({ ...formData, position: e.target.value })
              }
              className="w-full h-10 px-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div>
            <label className="block text-white/90 text-sm mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) =>
                onFormDataChange({ ...formData, status: e.target.value })
              }
              className="w-full h-10 px-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="new">New</option>
              <option value="screening">Screening</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label className="block text-white/90 text-sm mb-2">
              Experience (years)
            </label>
            <input
              type="number"
              value={formData.experience_years}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  experience_years: e.target.value,
                })
              }
              className="w-full h-10 px-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div>
            <label className="block text-white/90 text-sm mb-2">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                onFormDataChange({ ...formData, location: e.target.value })
              }
              className="w-full h-10 px-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div>
            <label className="block text-white/90 text-sm mb-2">
              Salary Expectation
            </label>
            <input
              type="number"
              value={formData.salary_expectation}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  salary_expectation: e.target.value,
                })
              }
              className="w-full h-10 px-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>

        {/* Social Media & Links */}
        <div>
          <h3 className="text-white/90 font-semibold mb-3">
            Social Media & Links
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/70 text-sm mb-2">
                LinkedIn
              </label>
              <input
                type="url"
                value={formData.linkedin_url || ""}
                onChange={(e) =>
                  onFormDataChange({
                    ...formData,
                    linkedin_url: e.target.value,
                  })
                }
                placeholder="https://linkedin.com/in/..."
                className="w-full h-10 px-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">GitHub</label>
              <input
                type="url"
                value={formData.github_url || ""}
                onChange={(e) =>
                  onFormDataChange({ ...formData, github_url: e.target.value })
                }
                placeholder="https://github.com/..."
                className="w-full h-10 px-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">
                Portfolio
              </label>
              <input
                type="url"
                value={formData.portfolio_url || ""}
                onChange={(e) =>
                  onFormDataChange({
                    ...formData,
                    portfolio_url: e.target.value,
                  })
                }
                placeholder="https://..."
                className="w-full h-10 px-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">
                Twitter
              </label>
              <input
                type="url"
                value={formData.twitter_url || ""}
                onChange={(e) =>
                  onFormDataChange({ ...formData, twitter_url: e.target.value })
                }
                placeholder="https://twitter.com/..."
                className="w-full h-10 px-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>
        </div>

        {/* Skills and Notes */}
        <div>
          <label className="block text-white/90 text-sm mb-2">
            Skills (comma-separated)
          </label>
          <input
            type="text"
            value={formData.skills}
            onChange={(e) =>
              onFormDataChange({ ...formData, skills: e.target.value })
            }
            placeholder="React, Node.js, Python"
            className="w-full h-10 px-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
        <div>
          <label className="block text-white/90 text-sm mb-2">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) =>
              onFormDataChange({ ...formData, notes: e.target.value })
            }
            rows={3}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting || uploading || parsingCV}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium transition-all disabled:opacity-50"
          >
            {isSubmitting ? "Adding..." : "Add Candidate"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
