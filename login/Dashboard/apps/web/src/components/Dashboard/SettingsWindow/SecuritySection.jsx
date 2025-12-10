import { useState } from "react";
import { ToggleSwitch } from "./ToggleSwitch";
import { PasswordChangeModal } from "./ProfileSection/PasswordChangeModal";

export function SecuritySection({ settings, updateSetting }) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Security</h3>
        <p className="text-gray-600">Keep your account secure</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <h4 className="font-semibold text-gray-800">
                Two-Factor Authentication
              </h4>
              <p className="text-sm text-gray-600">
                Add an extra layer of security
              </p>
            </div>
            <ToggleSwitch
              checked={settings.twoFactor}
              onChange={(checked) => updateSetting("twoFactor", checked)}
              color="red"
            />
          </div>

          <div className="py-3">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <PasswordChangeModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
}
