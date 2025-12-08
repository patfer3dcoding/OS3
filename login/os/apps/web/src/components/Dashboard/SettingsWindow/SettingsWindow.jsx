"use client";

import { useState } from "react";
import useUser from "@/utils/useUser";
import { useUpload } from "@/utils/useUpload";
import { useProfileData } from "@/hooks/useProfileData";
import { useSettings } from "@/hooks/useSettings";
import { usePhotoUpload } from "@/hooks/usePhotoUpload";
import { SettingsSidebar } from "./SettingsSidebar";
import { ProfileSection } from "./ProfileSection/ProfileSection";
import { NotificationsSection } from "./NotificationsSection";
import { SecuritySection } from "./SecuritySection";
import { AppearanceSection } from "./AppearanceSection";
import { AdvancedSection } from "./AdvancedSection";

export function SettingsWindow() {
  const { data: user, loading: userLoading, refetch } = useUser();
  const upload = useUpload();
  const [activeSection, setActiveSection] = useState("profile");

  const {
    profileData,
    setProfileData,
    editingProfile,
    setEditingProfile,
    updateProfileMutation,
    handleSaveProfile,
    handleCancelEdit,
  } = useProfileData(user, refetch);

  const { settings, updateSetting } = useSettings();

  const { uploadingPhoto, handlePhotoUpload } = usePhotoUpload(
    upload,
    profileData,
    setProfileData,
    updateProfileMutation,
  );

  return (
    <div className="flex h-full bg-gradient-to-br from-gray-50 to-slate-100">
      <SettingsSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-3xl mx-auto">
          {activeSection === "profile" && (
            <ProfileSection
              profileData={profileData}
              setProfileData={setProfileData}
              editingProfile={editingProfile}
              setEditingProfile={setEditingProfile}
              updateProfileMutation={updateProfileMutation}
              handleSaveProfile={handleSaveProfile}
              handleCancelEdit={handleCancelEdit}
              handlePhotoUpload={handlePhotoUpload}
              uploadingPhoto={uploadingPhoto}
            />
          )}

          {activeSection === "notifications" && (
            <NotificationsSection
              settings={settings}
              updateSetting={updateSetting}
            />
          )}

          {activeSection === "security" && (
            <SecuritySection
              settings={settings}
              updateSetting={updateSetting}
            />
          )}

          {activeSection === "appearance" && (
            <AppearanceSection
              settings={settings}
              updateSetting={updateSetting}
            />
          )}

          {activeSection === "advanced" && <AdvancedSection />}
        </div>
      </div>
    </div>
  );
}
