"use client";

import { REGISTER } from "@/api/apiEntpoint";
import baseApi from "@/api/base_url";
import { StateContext } from "@/app/providers/StateProvider";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useContext } from "react";
// Assuming you use icons from react-icons. Adding a placeholder for the toggle icon.
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";

// Helper component for the password eye icon (assuming this is how you intended it)
const PasswordToggleIcon = ({ onClick, className, isVisible }) => {
  // Determine which icon to show based on the visibility state (isVisible)
  const Icon = isVisible ? FaEyeSlash : FaEye;
  return <Icon onClick={onClick} className={className} />;
};

export default function Step_4() {
  // Destructure all necessary state, setters, and the final handler:
  const { setUserData, userData } = useContext(StateContext);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!password || !confirmPassword) {
        toast.error("Please fill in all required fields.");
        return;
      }
      if (password !== confirmPassword) {
        toast.error("Passwords do not match. Please try again.");
        return;
      }
      setUserData((prev) => ({
        ...prev,
        password,
        password_confirm: confirmPassword,
      }));

      const res = await axios.post(`${baseApi}/${REGISTER}`, {});
      router.push("/login");
    } catch (error) {
      toast.error(
        "An error occurred while submitting the form. Please try again.",
      );
    }
  };

  return (
    // Main container with full screen height and theme background
    <div className="min-h-screen flex items-center justify-center bg-BG">
      <div className="max-w-[1440px] w-11/12 mx-auto flex flex-col lg:flex-row justify-center items-center gap-12 min-h-screen lg:min-h-[700px]">
        {/* Left Side: Illustration */}
        <div className="w-1/2 hidden lg:flex flex-col gap-6 justify-center items-center">
          <h1 className="text-2xl md:text-3xl lg:text-[40px] font-semibold text-primary font-lora mt-10">
            Casezys
          </h1>

          <Image
            src={"/images/log_in.jpg"}
            height={465}
            width={500}
            alt="Avatar image"
            className="max-w-[460px] h-auto "
          />
        </div>

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
                {/* Passing the current showPassword state to the icon for correct rendering */}

                <PasswordToggleIcon
                  onClick={() => setShowPassword(!showPassword)}
                  isVisible={showPassword}
                  className="absolute right-3 top-[53px] transform -translate-y-1/2 w-5 h-5 cursor-pointer text-gray"
                />
              </div>
              {/* confirm Password Field */}
              <div className="relative">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium mb-2 text-text_color"
                >
                  Confirm Password
                </label>

                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="********"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 pr-10 rounded-xl border text-base focus:ring-2 focus:ring-opacity-50 transition duration-150 bg-element border-element text-text_color hover:ring-primary"
                  required
                />
                {/* Passing the current showPassword state to the icon for correct rendering */}

                <PasswordToggleIcon
                  onClick={() => setShowPassword(!showPassword)}
                  isVisible={showPassword}
                  className="absolute right-3 top-[53px] transform -translate-y-1/2 w-5 h-5 cursor-pointer text-gray"
                />
              </div>

              <label className="flex flex-row items-center gap-2 py-2">
                <input type="checkbox" name="" id="" />

                <p className="text-white">
                  I agree to the
                  <a href="#" className="text-primary">
                    Terms of Service
                  </a>{" "}
                  and
                  <a href="#" className="text-primary">
                    Privacy Policy
                  </a>
                </p>
              </label>
              {/* Login Button */}
              <button
                type="submit" // Disable button if fields are empty OR if the form is currently loading
                disabled={!confirmPassword || !password}
                className="w-full flex items-center justify-center p-4 rounded-xl bg-primary text-text_color text-base font-semibold transition duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                Continue
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
