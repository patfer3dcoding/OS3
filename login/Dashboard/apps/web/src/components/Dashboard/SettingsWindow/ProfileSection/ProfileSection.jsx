import { useState } from "react";
import { ProfileHeader } from "./ProfileHeader";
import { ProfilePhoto } from "./ProfilePhoto";
import { PersonalInformation } from "./PersonalInformation";
import { ProfessionalInformation } from "./ProfessionalInformation";
import { SocialLinks } from "./SocialLinks";
import { AccountActions } from "./AccountActions";
import { PasswordChangeModal } from "./PasswordChangeModal";

export function ProfileSection({
  profileData,
  setProfileData,
  editingProfile,
  setEditingProfile,
  updateProfileMutation,
  handleSaveProfile,
  handleCancelEdit,
  handlePhotoUpload,
  uploadingPhoto,
}) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  return (
    <div className="space-y-6">
      <ProfileHeader
        editingProfile={editingProfile}
        onEdit={() => setEditingProfile(true)}
        onSave={handleSaveProfile}
        onCancel={handleCancelEdit}
        isSaving={updateProfileMutation.isPending}
      />

      <ProfilePhoto
        profileData={profileData}
        editingProfile={editingProfile}
        onPhotoUpload={handlePhotoUpload}
        uploadingPhoto={uploadingPhoto}
      />

      <PersonalInformation
        profileData={profileData}
        setProfileData={setProfileData}
        editingProfile={editingProfile}
      />

      <ProfessionalInformation
        profileData={profileData}
        setProfileData={setProfileData}
        editingProfile={editingProfile}
      />

      <SocialLinks
        profileData={profileData}
        setProfileData={setProfileData}
        editingProfile={editingProfile}
      />

      <AccountActions onChangePassword={() => setShowPasswordModal(true)} />

      {showPasswordModal && (
        <PasswordChangeModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
}
