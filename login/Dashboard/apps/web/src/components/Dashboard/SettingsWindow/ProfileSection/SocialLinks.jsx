export function SocialLinks({ profileData, setProfileData, editingProfile }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h4 className="font-semibold text-gray-800 mb-4">Social Links</h4>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            LinkedIn
          </label>
          <input
            type="url"
            value={profileData.linkedin}
            onChange={(e) =>
              setProfileData({
                ...profileData,
                linkedin: e.target.value,
              })
            }
            disabled={!editingProfile}
            placeholder="https://linkedin.com/in/username"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Twitter
          </label>
          <input
            type="url"
            value={profileData.twitter}
            onChange={(e) =>
              setProfileData({
                ...profileData,
                twitter: e.target.value,
              })
            }
            disabled={!editingProfile}
            placeholder="https://twitter.com/username"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            GitHub
          </label>
          <input
            type="url"
            value={profileData.github}
            onChange={(e) =>
              setProfileData({
                ...profileData,
                github: e.target.value,
              })
            }
            disabled={!editingProfile}
            placeholder="https://github.com/username"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website
          </label>
          <input
            type="url"
            value={profileData.website}
            onChange={(e) =>
              setProfileData({
                ...profileData,
                website: e.target.value,
              })
            }
            disabled={!editingProfile}
            placeholder="https://yourwebsite.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />
        </div>
      </div>
    </div>
  );
}
