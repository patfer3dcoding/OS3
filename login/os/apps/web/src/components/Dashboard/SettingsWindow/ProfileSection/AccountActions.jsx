import { Lock } from "lucide-react";

export function AccountActions({ onChangePassword }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h4 className="font-semibold text-gray-800 mb-4">Account Actions</h4>
      <button
        onClick={onChangePassword}
        className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
      >
        <Lock size={18} />
        Change Password
      </button>
    </div>
  );
}
