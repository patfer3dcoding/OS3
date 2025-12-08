import { Edit2, Save, X } from "lucide-react";

export function ProfileHeader({
  editingProfile,
  onEdit,
  onSave,
  onCancel,
  isSaving,
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Profile Settings
        </h3>
        <p className="text-gray-600">Manage your personal information</p>
      </div>
      {!editingProfile ? (
        <button
          onClick={onEdit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <Edit2 size={18} />
          Edit Profile
        </button>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={onSave}
            disabled={isSaving}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            <Save size={18} />
            Save
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300"
          >
            <X size={18} />
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
