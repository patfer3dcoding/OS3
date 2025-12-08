export function ProfessionalInformation({
  profileData,
  setProfileData,
  editingProfile,
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h4 className="font-semibold text-gray-800 mb-4">
        Professional Information
      </h4>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company
          </label>
          <input
            type="text"
            value={profileData.company}
            onChange={(e) =>
              setProfileData({
                ...profileData,
                company: e.target.value,
              })
            }
            disabled={!editingProfile}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Department
          </label>
          <input
            type="text"
            value={profileData.department}
            onChange={(e) =>
              setProfileData({
                ...profileData,
                department: e.target.value,
              })
            }
            disabled={!editingProfile}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role / Job Title
          </label>
          <input
            type="text"
            value={profileData.role}
            onChange={(e) =>
              setProfileData({ ...profileData, role: e.target.value })
            }
            disabled={!editingProfile}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />
        </div>
      </div>
    </div>
  );
}
