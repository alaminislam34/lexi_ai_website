"use client";

import { useAuth } from "@/app/providers/Auth_Providers/AuthProviders";
import Image from "next/image";
import React, { useState } from "react";
import { Edit2, Save } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  
  // State for toggling edit mode
  const [isEditing, setIsEditing] = useState(false);

  // State for holding form data (initialized with mock or actual user data)
  // NOTE: In a real app, 'user' data would be the initial values
  const [profileData, setProfileData] = useState({
    name: user?.name || "Client Name", // Use user?.name if available
    location: "Dhaka, Bangladesh",
    preferredLegalArea: "Family Law", // Example change for clarity
    // In a real app, the image source would also be part of the state/user object
  });
  
  // State for password reset form
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
  });

  // Handler for form input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setProfileData(prevData => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Handler for saving profile changes (Simulated)
  const handleSaveProfile = (e) => {
    e.preventDefault();
    // 1. **SEND API REQUEST HERE** to update user profile with profileData
    console.log("Saving Profile Data:", profileData);
    
    // 2. After successful API call, exit edit mode
    setIsEditing(false);
    // You would typically handle error states or success toasts here
  };
  
  // Handler for password input changes
  const handlePasswordChange = (e) => {
    const { id, value } = e.target;
    setPasswordForm(prevData => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Handler for resetting password (Simulated)
  const handlePasswordReset = (e) => {
    e.preventDefault();
    // 1. **SEND API REQUEST HERE** to reset password
    console.log("Resetting Password with:", passwordForm);
    
    // 2. Clear the form fields after submission
    setPasswordForm({ oldPassword: "", newPassword: "" });
    // You would typically handle success/error feedback here
  };

  return (
    <section className="max-w-[1440px] mx-auto w-11/12 pt-28">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-medium">
          Profile Details
        </h1>
        
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition duration-300 ${
            isEditing
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-primary hover:bg-dark-primary text-white"
          }`}
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4" /> Cancel Edit
            </>
          ) : (
            <>
              <Edit2 className="w-4 h-4" /> Edit Profile
            </>
          )}
        </button>
      </div>

      <br />
      
      <Image
        src={"/images/user.jpg"} 
        height={300}
        width={300}
        alt="User image"
        className="w-14 md:w-20 h-14 md:h-20 rounded-full shadow shadow-gray/60"
      />
      <br />

      <form onSubmit={handleSaveProfile} className="space-y-4">
        
        <div>
          <label htmlFor="name" className="text-gray md:text-lg block">
            Name
          </label>
          {isEditing ? (
            <input
              type="text"
              id="name"
              value={profileData.name}
              onChange={handleChange}
              className="w-full md:w-1/2 py-2.5 px-4 border border-blue-400 rounded-xl mt-3  focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your full name"
            />
          ) : (
            <p className="w-full md:w-1/2 py-2.5 px-4 border rounded-xl mt-3">
              {profileData.name}
            </p>
          )}
        </div>
        
        {/* Location Field */}
        <div>
          <label htmlFor="location" className="text-gray md:text-lg block">
            Location
          </label>
          {isEditing ? (
            <input
              type="text"
              id="location"
              value={profileData.location}
              onChange={handleChange}
              className="w-full md:w-1/2 py-2.5 px-4 border border-blue-400 rounded-xl mt-3  focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="e.g. Dhaka, Bangladesh"
            />
          ) : (
            <p className="w-full md:w-1/2 py-2.5 px-4 border rounded-xl mt-3">
              {profileData.location}
            </p>
          )}
        </div>
        
        {/* Preferred Legal Area Field */}
        <div>
          <label htmlFor="preferredLegalArea" className="text-gray md:text-lg block">
            Preferred Legal Area
          </label>
          {isEditing ? (
            <input
              type="text"
              id="preferredLegalArea"
              value={profileData.preferredLegalArea}
              onChange={handleChange}
              className="w-full md:w-1/2 py-2.5 px-4 border border-blue-400 rounded-xl mt-3  focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="e.g. Corporate Law, Civil Litigation"
            />
          ) : (
            <p className="w-full md:w-1/2 py-2.5 px-4 border rounded-xl mt-3">
              {profileData.preferredLegalArea}
            </p>
          )}
        </div>

        {/* Save Changes Button (only visible when editing) */}
        {isEditing && (
          <button
            type="submit"
            className={`flex items-center justify-center gap-2 w-full md:w-1/2 py-2.5 rounded-lg text-white text-sm sm:text-base md:text-lg transition duration-300 bg-primary hover:bg-dark-primary mt-6`}
          >
            <Save className="w-5 h-5" /> Save Profile Changes
          </button>
        )}
      </form>

      <br />
      <br />
      <hr className="my-8" />
      
      {/* Reset Password Section */}
      <div>
        <h1 className="text-lg md:text-xl font-semibold">Reset Password</h1>
        <br />
        <form onSubmit={handlePasswordReset} className="flex flex-col md:flex-row gap-6 md:items-end">
          <label className="flex flex-col gap-2 flex-1 max-w-xs">
            <span className="text-gray">Old Password</span>
            <input
              type="password"
              id="oldPassword"
              value={passwordForm.oldPassword}
              onChange={handlePasswordChange}
              placeholder="********"
              className="py-2.5 px-4 border rounded-xl mt-3 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </label>
          <label className="flex flex-col gap-2 flex-1 max-w-xs">
            <span className="text-gray">New Password</span>
            <input
              type="password"
              id="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              placeholder="********"
              className="py-2.5 px-4 border rounded-xl mt-3 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </label>
          <button
            type="submit"
            className={`mt-4 md:mt-0 px-6 h-12 py-2 rounded-lg text-white text-sm sm:text-base transition duration-300 bg-primary hover:bg-dark-primary`}
          >
            Update Password
          </button>
        </form>
      </div>
    </section>
  );
}