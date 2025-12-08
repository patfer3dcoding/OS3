import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";

export function useProfileData(user, refetch) {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    company: "",
    department: "",
    role: "",
    location: "",
    linkedin: "",
    twitter: "",
    github: "",
    website: "",
    image: "",
  });

  const [editingProfile, setEditingProfile] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
        company: user.company || "",
        department: user.department || "",
        role: user.role || "",
        location: user.location || "",
        linkedin: user.linkedin || "",
        twitter: user.twitter || "",
        github: user.github || "",
        website: user.website || "",
        image: user.image || "",
      });
    }
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch("/api/profile/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update profile");
      return response.json();
    },
    onSuccess: () => {
      refetch();
      setEditingProfile(false);
    },
  });

  const handleSaveProfile = () => {
    updateProfileMutation.mutate(profileData);
  };

  const handleCancelEdit = () => {
    setEditingProfile(false);
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
        company: user.company || "",
        department: user.department || "",
        role: user.role || "",
        location: user.location || "",
        linkedin: user.linkedin || "",
        twitter: user.twitter || "",
        github: user.github || "",
        website: user.website || "",
        image: user.image || "",
      });
    }
  };

  return {
    profileData,
    setProfileData,
    editingProfile,
    setEditingProfile,
    updateProfileMutation,
    handleSaveProfile,
    handleCancelEdit,
  };
}
