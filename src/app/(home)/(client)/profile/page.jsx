"use client";

import Image from "next/image";
import React, { useState, useEffect, useContext } from "react";
import { Edit2, Save, Camera, Loader2, Lock } from "lucide-react";
import { StateContext } from "@/app/providers/StateProvider";
import axios from "axios";
import { toast } from "react-toastify";
import { PASSWORD_CHANGE, PROFILE_DETAILS } from "@/api/apiEntpoint";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function Profile() {
  const { setUser } = useContext(StateContext);
  const queryClient = useQueryClient();

  // Local UI States
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [profileData, setProfileData] = useState({
    full_name: "",
    phone: "",
    gender: "",
    location: "",
    preferred_legal_area: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    newConfirmPassword: "",
  });

  // --- 1. Fetch Profile Data ---
  const { data: user, isLoading: isFetchingUser } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const tokenData = JSON.parse(localStorage.getItem("token"));
      const res = await axios.get(`http://10.10.7.19:8002${PROFILE_DETAILS}`, {
        headers: { Authorization: `Bearer ${tokenData?.accessToken}` },
      });
      return res.data;
    },
  });

  // Sync internal form state when data is fetched
  useEffect(() => {
    if (user) {
      setProfileData({
        full_name: user.full_name || "",
        phone: user.phone || "",
        gender: user.gender || "",
        location: user.location || "",
        preferred_legal_area: user.preferred_legal_area || "",
      });
      setPreviewUrl(user.profile_image);
      setUser(user); // Sync global context if needed
    }
  }, [user, setUser]);

  // --- 2. Update Profile Mutation ---
  const profileMutation = useMutation({
    mutationFn: async (formData) => {
      const tokenData = JSON.parse(localStorage.getItem("token"));
      const res = await axios.put(
        `http://10.10.7.19:8002${PROFILE_DETAILS}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${tokenData?.accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return res.data;
    },
    onSuccess: (updatedData) => {
      queryClient.invalidateQueries(["profile"]); // Refetch instant
      setUser(updatedData);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      setSelectedFile(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Update failed");
    },
  });

  // --- 3. Update Password Mutation ---
  const passwordMutation = useMutation({
    mutationFn: async (passData) => {
      const tokenData = JSON.parse(localStorage.getItem("token"));
      return await axios.post(
        `http://10.10.7.19:8002${PASSWORD_CHANGE}`,
        passData,
        {
          headers: { Authorization: `Bearer ${tokenData?.accessToken}` },
        },
      );
    },
    onSuccess: () => {
      toast.success("Password changed!");
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        newConfirmPassword: "",
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || "Failed to change password");
    },
  });

  // Handlers
  const handleChange = (e) => {
    const { id, value } = e.target;
    setProfileData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(profileData).forEach((key) =>
      formData.append(key, profileData[key]),
    );
    if (selectedFile) formData.append("profile_image", selectedFile);

    profileMutation.mutate(formData);
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    if (
      !passwordForm.oldPassword ||
      !passwordForm.newPassword ||
      !passwordForm.newConfirmPassword
    ) {
      return toast.warn("Fill all password fields");
    }
    passwordMutation.mutate({
      old_password: passwordForm.oldPassword,
      new_password: passwordForm.newPassword,
      new_password_confirm: passwordForm.newConfirmPassword,
    });
  };

  if (isFetchingUser) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-10 h-10 text-primary" />
      </div>
    );
  }

  return (
    <section className="max-w-[1440px] mx-auto w-11/12 pt-28 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-medium">
          Profile Details
        </h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition ${
            isEditing ? "bg-red-500 text-white" : "bg-primary text-white"
          }`}
        >
          {isEditing ? (
            "Cancel Edit"
          ) : (
            <>
              <Edit2 className="w-4 h-4" /> Edit Profile
            </>
          )}
        </button>
      </div>

      {/* Profile Image Section */}
      <div className="mt-8 relative w-24 h-24 md:w-32 md:h-32">
        <Image
          src={previewUrl || "/images/user.jpg"}
          height={200}
          width={200}
          alt="Profile"
          unoptimized
          className="w-full h-full rounded-full shadow-lg object-cover border-4 border-white"
        />
        {isEditing && (
          <label className="absolute bottom-1 right-1 bg-primary p-2 rounded-full cursor-pointer hover:bg-dark-primary transition">
            <Camera className="w-4 h-4 text-white" />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
        )}
      </div>

      {/* Info Form */}
      <form
        onSubmit={handleSaveProfile}
        className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {[
          { label: "Full Name", id: "full_name", type: "text" },
          { label: "Phone", id: "phone", type: "text" },
          { label: "Location", id: "location", type: "text" },
        ].map((field) => (
          <div key={field.id} className="flex flex-col gap-2">
            <label className="text-gray font-medium">{field.label}</label>
            <input
              id={field.id}
              disabled={!isEditing}
              value={profileData[field.id]}
              onChange={handleChange}
              className={`p-3 rounded-xl border transition ${isEditing ? "border-blue-400" : " border-gray-200"}`}
            />
          </div>
        ))}

        <div className="flex flex-col gap-2">
          <label className="text-gray font-medium">Gender</label>
          <select
            id="gender"
            disabled={!isEditing}
            value={profileData.gender}
            onChange={handleChange}
            className={`p-3 rounded-xl border transition ${isEditing ? "border-blue-400 bg-transparent" : " border-gray-200"}`}
          >
            <option className="bg-gray-700" value="male">
              Male
            </option>
            <option className="bg-gray-700" value="female">
              Female
            </option>
            <option className="bg-gray-700" value="other">
              Other
            </option>
          </select>
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-gray font-medium">Preferred Legal Area</label>
          <input
            id="preferred_legal_area"
            disabled={!isEditing}
            value={profileData.preferred_legal_area}
            onChange={handleChange}
            className={`p-3 rounded-xl border transition ${isEditing ? "border-blue-400" : " border-gray-200"}`}
          />
        </div>

        {isEditing && (
          <button
            type="submit"
            disabled={profileMutation.isPending}
            className="flex items-center justify-center gap-2 bg-primary text-white p-4 rounded-xl font-semibold hover:bg-dark-primary transition"
          >
            {profileMutation.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5" /> Update Profile
              </>
            )}
          </button>
        )}
      </form>

      <hr className="my-12 border-gray-200" />

      {/* Password Reset Section */}
      <div className="max-w-2xl">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Lock className="w-5 h-5" /> Security & Password
        </h2>
        <form
          onSubmit={handlePasswordReset}
          className="mt-6 flex flex-col md:flex-row gap-4"
        >
          <input
            type="password"
            placeholder="Old Password"
            value={passwordForm.oldPassword}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, oldPassword: e.target.value })
            }
            className="px-4 py-2 rounded-xl border border-gray-300 flex-1"
          />
          <input
            type="password"
            placeholder="New Password"
            value={passwordForm.newPassword}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, newPassword: e.target.value })
            }
            className="px-4 py-2 rounded-xl border border-gray-300 flex-1"
          />
          <input
            type="password"
            placeholder="New Confirm Password"
            value={passwordForm.newConfirmPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                newConfirmPassword: e.target.value,
              })
            }
            className="px-4 py-2 rounded-xl border border-gray-300 flex-1"
          />
          <div>
            <button
              type="submit"
              disabled={passwordMutation.isPending}
              className="bg-primary text-white px-6 inline-block truncate py-2 rounded-xl font-medium hover:bg-dark-primary transition"
            >
              {passwordMutation.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Update Password"
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
