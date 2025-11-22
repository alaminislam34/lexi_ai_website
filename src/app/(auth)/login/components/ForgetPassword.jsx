"use client";

import { EyeOff, Eye } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function ForgetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const PasswordToggleIcon = showPassword ? EyeOff : Eye;
  const handleSubmit = (e) => {
    e.preventDefault();

    // Add your submit logic here
    if (!password || !confirmPassword) {
      toast.error("Please enter both password and confirm password.");
      return;
    } else if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    } else {
      toast.success("Password set successfully!");
    }
  };
  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
      <div className="w-full max-w-xl">
        <header className="mb-12 text-center">
          <h1 className="text-2xl md:text-3xl lg:text-[40px] font-bold text-text_color font-lora ">
            Set a Password
          </h1>
          <p className="text-sm mt-4 text-gray max-w-11/12 mx-auto">
            Set a strong password to keep your account secure
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* password Field */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2 text-text_color"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="***********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 pr-10 rounded-xl border text-base focus:ring-2 focus:ring-opacity-50 transition duration-150 bg-element border-element text-text_color hover:ring-primary"
              required
            />
            <PasswordToggleIcon
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[53px] transform -translate-y-1/2 w-5 h-5 cursor-pointer text-gray"
            />
          </div>

          {/* confirm Password Field */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2 text-text_color"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 pr-10 rounded-xl border text-base focus:ring-2 focus:ring-opacity-50 transition duration-150 bg-element border-element text-text_color hover:ring-primary"
              required
            />
            <PasswordToggleIcon
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[53px] transform -translate-y-1/2 w-5 h-5 cursor-pointer text-gray"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={!confirmPassword || !password}
            className="w-full flex items-center justify-center p-4 rounded-xl bg-primary text-text_color text-base font-semibold transition duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
