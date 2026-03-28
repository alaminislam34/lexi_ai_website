"use client";
import React, { useState, useRef, useMemo } from "react";
import Image from "next/image"; // Next.js Image component
import { PROFILE_DETAILS } from "../../../../api/apiEntpoint";
import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import baseApi from "../../../../api/base_url";

const ProfilePage = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  // --- 1. Fetch User Data ---
  const { data: user, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const tokenData = JSON.parse(localStorage.getItem("token"));
      const res = await baseApi.get(`${PROFILE_DETAILS}`, {
        headers: { Authorization: `Bearer ${tokenData?.accessToken}` },
      });
      return res.data;
    },
  });

  /**
   * FIX FOR THE "CASCADE RENDER" ERROR:
   * Instead of using useEffect to sync state, we initialize the form
   * state directly from the query data or keep a local draft.
   */
  const [draftData, setDraftData] = useState(null);

  // This merges the server data with any changes the user has typed
  const formData = useMemo(() => {
    return {
      full_name: draftData?.full_name ?? user?.full_name ?? "",
      phone: draftData?.phone ?? user?.phone ?? "",
      location: draftData?.location ?? user?.location ?? "",
      preferred_legal_area:
        draftData?.preferred_legal_area ??
        user?.preferred_legal_area ??
        "Criminal",
    };
  }, [user, draftData]);

  // --- 2. Mutation for Updating ---
  const mutation = useMutation({
    mutationFn: async (payload) => {
      const tokenData = JSON.parse(localStorage.getItem("token"));
      const res = await baseApi.put(`${PROFILE_DETAILS}`, payload, {
        headers: {
          Authorization: `Bearer ${tokenData?.accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    },
    onSuccess: (updatedResponse) => {
      const newUserData = updatedResponse?.data || updatedResponse;
      queryClient.setQueryData(["profile"], newUserData);
      queryClient.invalidateQueries({ queryKey: ["profile"] });

      toast.success("Profile updated successfully!");
      setIsEditing(false);
      setDraftData(null); // Clear the draft after success
      setSelectedImage(null);
    },
    onError: () => toast.error("Failed to update profile."),
  });

  const handleChange = (e) => {
    setDraftData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (selectedImage) data.append("image", selectedImage);
    mutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="w-full py-10 text-gray-100 pt-20 xl:pt-24 pb-20 bg-black min-h-screen">
      <div className="max-w-[1440px] mx-auto w-11/12">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-800 pb-8 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              Profile Settings
            </h1>
            <p className="text-gray-400 mt-2">
              Update your information securely.
            </p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl border border-zinc-700 transition flex items-center gap-2"
            >
              Edit Profile
            </button>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 backdrop-blur-sm sticky top-24 shadow-2xl">
              <div className="flex flex-col items-center">
                <div
                  className={`relative w-40 h-40 group ${isEditing ? "cursor-pointer" : ""}`}
                  onClick={() => isEditing && fileInputRef.current.click()}
                >
                  <Image
                    src={
                      selectedImage
                        ? URL.createObjectURL(selectedImage)
                        : user?.profile_image || "/default-avatar.png"
                    }
                    alt="Profile"
                    fill
                    className={`rounded-3xl object-cover ring-4 ring-zinc-800 transition ${isEditing ? "group-hover:opacity-75 ring-blue-500/50" : ""}`}
                  />
                  {isEditing && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-xs font-bold uppercase bg-black/40 rounded-3xl">
                      Change Photo
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => setSelectedImage(e.target.files[0])}
                    accept="image/*"
                  />
                </div>

                <div className="mt-6 text-center">
                  <h2 className="text-2xl font-bold">{user?.full_name}</h2>
                  <span className="inline-block px-3 py-1 mt-2 text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-400/10 rounded-full border border-blue-400/20">
                    {user?.role}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Area: Form */}
          <div className="lg:col-span-8">
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
              <form onSubmit={handleUpdate} className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                  {/* Fields */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-gray-200 outline-none focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-lg text-gray-200 font-medium py-1">
                        {user?.full_name || "—"}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-gray-200 outline-none focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-lg text-gray-200 font-medium py-1">
                        {user?.phone || "—"}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                      Office Location
                    </label>
                    {isEditing ? (
                      <input
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-gray-200 outline-none focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-lg text-gray-200 font-medium py-1">
                        {user?.location || "—"}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                      Legal Specialization
                    </label>
                    {isEditing ? (
                      <select
                        name="preferred_legal_area"
                        value={formData.preferred_legal_area}
                        onChange={handleChange}
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-gray-200 outline-none"
                      >
                        <option value="Criminal">Criminal Law</option>
                        <option value="Civil">Civil Law</option>
                        <option value="Corporate">Corporate Law</option>
                        <option value="Family">Family Law</option>
                      </select>
                    ) : (
                      <p className="text-lg text-gray-200 font-medium py-1">
                        {user?.preferred_legal_area} Law
                      </p>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex items-center justify-end space-x-4 pt-10 border-t border-zinc-800">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setDraftData(null);
                      }}
                      className="text-gray-400 hover:text-white transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={mutation.isPending}
                      className="px-10 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 shadow-lg disabled:opacity-50 transition-all"
                    >
                      {mutation.isPending ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
