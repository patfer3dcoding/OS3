export function JobForm({
  formData,
  onFormDataChange,
  onSubmit,
  onCancel,
  isSubmitting,
}) {
  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-white mb-6">Post New Job</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-white/90 text-sm mb-2">
            Job Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) =>
              onFormDataChange({ ...formData, title: e.target.value })
            }
            className="w-full h-10 px-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white/90 text-sm mb-2">
              Department
            </label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) =>
                onFormDataChange({ ...formData, department: e.target.value })
              }
              className="w-full h-10 px-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
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
              className="w-full h-10 px-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
          <div>
            <label className="block text-white/90 text-sm mb-2">Job Type</label>
            <select
              value={formData.job_type}
              onChange={(e) =>
                onFormDataChange({ ...formData, job_type: e.target.value })
              }
              className="w-full h-10 px-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>
          <div>
            <label className="block text-white/90 text-sm mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) =>
                onFormDataChange({ ...formData, status: e.target.value })
              }
              className="w-full h-10 px-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div>
            <label className="block text-white/90 text-sm mb-2">
              Min Salary
            </label>
            <input
              type="number"
              value={formData.salary_min}
              onChange={(e) =>
                onFormDataChange({ ...formData, salary_min: e.target.value })
              }
              className="w-full h-10 px-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
          <div>
            <label className="block text-white/90 text-sm mb-2">
              Max Salary
            </label>
            <input
              type="number"
              value={formData.salary_max}
              onChange={(e) =>
                onFormDataChange({ ...formData, salary_max: e.target.value })
              }
              className="w-full h-10 px-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
        </div>
        <div>
          <label className="block text-white/90 text-sm mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              onFormDataChange({ ...formData, description: e.target.value })
            }
            rows={4}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>
        <div>
          <label className="block text-white/90 text-sm mb-2">
            Requirements (one per line)
          </label>
          <textarea
            value={formData.requirements}
            onChange={(e) =>
              onFormDataChange({ ...formData, requirements: e.target.value })
            }
            rows={4}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-white font-medium transition-all disabled:opacity-50"
          >
            {isSubmitting ? "Posting..." : "Post Job"}
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
