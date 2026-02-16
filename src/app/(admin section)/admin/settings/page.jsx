"use client";
import { useState } from "react";
import { Camera, Lock, User, Phone, Mail } from "lucide-react";

const SettingPage = () => {
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@example.com",
    phone: "+1 (555) 000-1234",
    image: null,
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-500 mt-2">
          Manage your account settings and security preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-[#161618] rounded-xl border border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <User size={20} className="text-[#00bcd4]" />
              Profile Information
            </h2>

            <div className="space-y-6">
              {/* Avatar Upload */}
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-800">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-[#1c1c1e] border-2 border-dashed border-gray-700 flex items-center justify-center overflow-hidden">
                    {profile.image ? (
                      <img
                        src={profile.image}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-gray-500">
                        AD
                      </span>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-[#00bcd4] p-2 rounded-full cursor-pointer hover:scale-110 transition-transform">
                    <Camera size={16} className="text-black" />
                    <input type="file" className="hidden" />
                  </label>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-white font-medium">Profile Picture</p>
                  <p className="text-gray-500 text-sm mt-1">
                    PNG, JPG or GIF. Max 2MB.
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Full Name</label>
                  <input
                    type="text"
                    defaultValue={profile.name}
                    className="w-full bg-[#1c1c1e] border border-gray-800 rounded-lg py-2.5 px-4 text-white focus:ring-1 focus:ring-[#00bcd4] outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Phone Number</label>
                  <div className="relative">
                    <Phone
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
                    />
                    <input
                      type="text"
                      defaultValue={profile.phone}
                      className="w-full bg-[#1c1c1e] border border-gray-800 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-1 focus:ring-[#00bcd4] outline-none"
                    />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm text-gray-400">
                    Email Address (Read-only)
                  </label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
                    />
                    <input
                      type="email"
                      value={profile.email}
                      readOnly
                      className="w-full bg-[#0a0a0b] border border-gray-800 rounded-lg py-2.5 pl-10 pr-4 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <button className="bg-[#00bcd4] text-black font-semibold py-2.5 px-6 rounded-lg hover:bg-[#00acc1] transition-colors">
                Save Changes
              </button>
            </div>
          </section>
        </div>

        {/* Right Column: Password Change */}
        <div className="lg:col-span-1">
          <section className="bg-[#161618] rounded-xl border border-gray-800 p-6 sticky top-8">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Lock size={20} className="text-[#00bcd4]" />
              Security
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Old Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-[#1c1c1e] border border-gray-800 rounded-lg py-2.5 px-4 text-white focus:ring-1 focus:ring-[#00bcd4] outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-[#1c1c1e] border border-gray-800 rounded-lg py-2.5 px-4 text-white focus:ring-1 focus:ring-[#00bcd4] outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-[#1c1c1e] border border-gray-800 rounded-lg py-2.5 px-4 text-white focus:ring-1 focus:ring-[#00bcd4] outline-none"
                />
              </div>

              <button className="w-full bg-transparent border border-[#00bcd4] text-[#00bcd4] font-semibold py-2.5 px-6 rounded-lg hover:bg-[#00bcd4]/10 transition-colors mt-4">
                Update Password
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
