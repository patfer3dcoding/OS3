import { ToggleSwitch } from "./ToggleSwitch";

export function AppearanceSection({ settings, updateSetting }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Appearance</h3>
        <p className="text-gray-600">Customize how the app looks</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <h4 className="font-semibold text-gray-800">Dark Mode</h4>
              <p className="text-sm text-gray-600">Switch to dark theme</p>
            </div>
            <ToggleSwitch
              checked={settings.darkMode}
              onChange={(checked) => updateSetting("darkMode", checked)}
              color="purple"
            />
          </div>

          <div className="py-3">
            <h4 className="font-semibold text-gray-800 mb-3">Language</h4>
            <select
              value={settings.language}
              onChange={(e) => updateSetting("language", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
