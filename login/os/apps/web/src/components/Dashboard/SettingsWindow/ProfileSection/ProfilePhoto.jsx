import { Camera } from "lucide-react";

export function ProfilePhoto({
  profileData,
  editingProfile,
  onPhotoUpload,
  uploadingPhoto,
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h4 className="font-semibold text-gray-800 mb-4">Profile Photo</h4>
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
            {profileData.image ? (
              <img
                src={profileData.image}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              profileData.name?.charAt(0)?.toUpperCase() || "U"
            )}
          </div>
          {editingProfile && (
            <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer transition-all duration-300 shadow-lg">
              <Camera size={16} />
              <input
                type="file"
                accept="image/*"
                onChange={onPhotoUpload}
                className="hidden"
                disabled={uploadingPhoto}
              />
            </label>
          )}
        </div>
        <div>
          <p className="font-semibold text-gray-800">
            {profileData.name || "Your Name"}
          </p>
          <p className="text-sm text-gray-600">{profileData.email}</p>
          <p className="text-sm text-gray-500 mt-2">
            {profileData.role || "User"}
          </p>
        </div>
      </div>
    </div>
  );
}
