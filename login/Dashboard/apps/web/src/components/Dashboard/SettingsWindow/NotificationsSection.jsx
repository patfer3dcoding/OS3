import { ToggleSwitch } from "./ToggleSwitch";

export function NotificationsSection({ settings, updateSetting }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Notifications</h3>
        <p className="text-gray-600">Manage how you receive notifications</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <h4 className="font-semibold text-gray-800">
                Push Notifications
              </h4>
              <p className="text-sm text-gray-600">
                Receive push notifications on your device
              </p>
            </div>
            <ToggleSwitch
              checked={settings.notifications}
              onChange={(checked) => updateSetting("notifications", checked)}
              color="blue"
            />
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <h4 className="font-semibold text-gray-800">Email Alerts</h4>
              <p className="text-sm text-gray-600">
                Get email notifications for important updates
              </p>
            </div>
            <ToggleSwitch
              checked={settings.emailAlerts}
              onChange={(checked) => updateSetting("emailAlerts", checked)}
              color="blue"
            />
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <h4 className="font-semibold text-gray-800">Auto Archive</h4>
              <p className="text-sm text-gray-600">
                Automatically archive old notifications
              </p>
            </div>
            <ToggleSwitch
              checked={settings.autoArchive}
              onChange={(checked) => updateSetting("autoArchive", checked)}
              color="blue"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
