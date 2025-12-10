import { useState } from "react";

export function useSettings() {
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    darkMode: false,
    language: "en",
    autoArchive: false,
    twoFactor: false,
  });

  const updateSetting = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  return {
    settings,
    updateSetting,
  };
}
