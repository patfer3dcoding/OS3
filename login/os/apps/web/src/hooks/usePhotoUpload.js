import { useState } from "react";

export function usePhotoUpload(
  upload,
  profileData,
  setProfileData,
  updateProfileMutation,
) {
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const uploadedUrl = await upload(file);
      setProfileData({ ...profileData, image: uploadedUrl });
      await updateProfileMutation.mutateAsync({ image: uploadedUrl });
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert("Failed to upload photo");
    } finally {
      setUploadingPhoto(false);
    }
  };

  return {
    uploadingPhoto,
    handlePhotoUpload,
  };
}
