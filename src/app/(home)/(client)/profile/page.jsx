"use client";

import Image from "next/image";
import React, { useState, useEffect, useContext } from "react";
import {
  Edit2,
  Save,
  Camera,
  Loader2,
  Lock,
  Mail,
  Calendar,
  User,
  MapPin,
  Briefcase,
} from "lucide-react";
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
      const res = await axios.get(`http://3.142.150.64${PROFILE_DETAILS}`, {
        headers: { Authorization: `Bearer ${tokenData?.accessToken}` },
      });
      return res.data;
    },
  });

  // Sync state when data is fetched
  useEffect(() => {
    if (user) {
      setProfileData({
        full_name: user.full_name || "",
        phone: user.phone || "",
        gender: user.gender || "male",
        location: user.location || "",
        preferred_legal_area: user.preferred_legal_area || "",
      });
      setPreviewUrl(user.profile_image);
      setUser(user);
    }
  }, [user, setUser]);

  // --- 2. Update Profile Mutation ---
  const profileMutation = useMutation({
    mutationFn: async (formData) => {
      const tokenData = JSON.parse(localStorage.getItem("token"));
      const res = await axios.put(
        `http://3.142.150.64${PROFILE_DETAILS}`,
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
      queryClient.invalidateQueries(["profile"]);
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
        `http://3.142.150.64${PASSWORD_CHANGE}`,
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
      <div className="h-screen flex items-center justify-center bg-black">
        <Loader2 className="animate-spin w-10 h-10 text-primary" />
      </div>
    );
  }

  return (
    <section className="max-w-[1440px] mx-auto w-11/12 pt-28 pb-20 text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-800 pb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Account Settings
          </h1>
          <p className="text-zinc-400 mt-2">
            View and update your personal profile and security settings.
          </p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${
            isEditing
              ? "bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white"
              : "bg-primary text-white hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)]"
          }`}
        >
          {isEditing ? (
            "Cancel Editing"
          ) : (
            <>
              <Edit2 className="w-4 h-4" /> Edit Profile
            </>
          )}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-16 mt-12">
        {/* Left Side: Avatar & Identity */}
        <div className="lg:w-1/3 flex flex-col items-center lg:items-start">
          <div className="relative group">
            <div className="w-44 h-44 rounded-full p-1 border-2 border-primary/30 group-hover:border-primary transition-all duration-500">
              <Image
                src={previewUrl || "/default_profile.png"}
                height={176}
                width={176}
                alt="Profile"
                unoptimized
                className="w-full h-full rounded-full object-cover bg-zinc-900"
              />
            </div>
            {isEditing && (
              <label className="absolute bottom-2 right-2 bg-primary p-3 rounded-full cursor-pointer shadow-xl hover:scale-110 active:scale-95 transition-all">
                <Camera className="w-5 h-5 text-white" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>

          <div className="mt-8 space-y-4 w-full text-center lg:text-left">
            <div>
              <h2 className="text-2xl font-bold text-white uppercase tracking-wide">
                {user?.full_name}
              </h2>
              <span className="text-xs font-bold text-primary px-2 py-0.5 rounded bg-primary/10 uppercase">
                {user?.role || "Member"}
              </span>
            </div>

            <div className="space-y-3 pt-4 border-t border-zinc-800">
              <div className="flex items-center gap-3 text-zinc-400 text-sm">
                <Mail className="w-4 h-4 text-primary" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-400 text-sm">
                <Calendar className="w-4 h-4 text-primary" />
                <span>
                  Joined{" "}
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="lg:w-2/3 bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800">
          <form onSubmit={handleSaveProfile} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Full Name */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
                  <User className="w-3 h-3" /> Full Name
                </label>
                <input
                  id="full_name"
                  disabled={!isEditing}
                  placeholder="Enter your full name"
                  value={profileData.full_name}
                  onChange={handleChange}
                  className={`w-full p-3.5 rounded-xl bg-black border transition-all duration-300 outline-none ${
                    isEditing
                      ? "border-primary/50 text-white focus:border-primary focus:ring-1 focus:ring-primary"
                      : "border-zinc-800 text-zinc-400 cursor-not-allowed"
                  }`}
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">
                  Phone Number
                </label>
                <input
                  id="phone"
                  disabled={!isEditing}
                  placeholder="e.g. +1 234 567 890"
                  value={profileData.phone}
                  onChange={handleChange}
                  className={`w-full p-3.5 rounded-xl bg-black border transition-all duration-300 outline-none ${
                    isEditing
                      ? "border-primary/50 text-white focus:border-primary focus:ring-1 focus:ring-primary"
                      : "border-zinc-800 text-zinc-400 cursor-not-allowed"
                  }`}
                />
              </div>

              {/* Gender */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">
                  Gender
                </label>
                <select
                  id="gender"
                  disabled={!isEditing}
                  value={profileData.gender}
                  onChange={handleChange}
                  className={`w-full p-3.5 rounded-xl bg-black border transition-all duration-300 outline-none appearance-none ${
                    isEditing
                      ? "border-primary/50 text-white focus:border-primary"
                      : "border-zinc-800 text-zinc-400 cursor-not-allowed"
                  }`}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Location */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
                  <MapPin className="w-3 h-3" /> Location
                </label>
                <input
                  id="location"
                  disabled={!isEditing}
                  placeholder="City, Country"
                  value={profileData.location}
                  onChange={handleChange}
                  className={`w-full p-3.5 rounded-xl bg-black border transition-all duration-300 outline-none ${
                    isEditing
                      ? "border-primary/50 text-white focus:border-primary focus:ring-1 focus:ring-primary"
                      : "border-zinc-800 text-zinc-400 cursor-not-allowed"
                  }`}
                />
              </div>

              {/* Legal Area */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
                  <Briefcase className="w-3 h-3" /> Preferred Legal Area
                </label>
                <input
                  id="preferred_legal_area"
                  disabled={!isEditing}
                  placeholder="e.g. Criminal Law, Corporate"
                  value={profileData.preferred_legal_area}
                  onChange={handleChange}
                  className={`w-full p-3.5 rounded-xl bg-black border transition-all duration-300 outline-none ${
                    isEditing
                      ? "border-primary/50 text-white focus:border-primary focus:ring-1 focus:ring-primary"
                      : "border-zinc-800 text-zinc-400 cursor-not-allowed"
                  }`}
                />
              </div>
            </div>

            {isEditing && (
              <button
                type="submit"
                disabled={profileMutation.isPending}
                className="w-full flex items-center justify-center gap-2 bg-primary text-white p-4 rounded-xl font-bold transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
              >
                {profileMutation.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5" /> Save Profile Changes
                  </>
                )}
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Security Section */}
      <div className="mt-16 p-8 bg-zinc-900/30 rounded-3xl border border-zinc-800/50">
        <h2 className="text-xl font-bold flex items-center gap-2 text-white">
          <Lock className="w-5 h-5 text-primary" /> Security & Privacy
        </h2>
        <p className="text-zinc-500 text-sm mt-1">
          Updating your password regularly helps keep your account secure.
        </p>

        <form
          onSubmit={handlePasswordReset}
          className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <input
            type="password"
            placeholder="Current Password"
            value={passwordForm.oldPassword}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, oldPassword: e.target.value })
            }
            className="px-4 py-3.5 rounded-xl bg-black border border-zinc-800 text-white focus:border-primary outline-none transition-all"
          />
          <input
            type="password"
            placeholder="New Password"
            value={passwordForm.newPassword}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, newPassword: e.target.value })
            }
            className="px-4 py-3.5 rounded-xl bg-black border border-zinc-800 text-white focus:border-primary outline-none transition-all"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={passwordForm.newConfirmPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                newConfirmPassword: e.target.value,
              })
            }
            className="px-4 py-3.5 rounded-xl bg-black border border-zinc-800 text-white focus:border-primary outline-none transition-all"
          />
          <button
            type="submit"
            disabled={passwordMutation.isPending}
            className="bg-zinc-100 text-black px-6 py-3.5 rounded-xl font-bold hover:bg-white transition-all disabled:opacity-50"
          >
            {passwordMutation.isPending ? (
              <Loader2 className="animate-spin mx-auto" />
            ) : (
              "Update Password"
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
