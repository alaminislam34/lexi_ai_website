"use client";

import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc"; // Using react-icons for Google icon for fidelity

// Custom color utility classes based on your theme
// Note: In a real Tailwind setup, you would configure these in your tailwind.config.js
// For a standalone component, we'll use inline styles or direct hex codes for critical parts.

// Placeholder Image component (Replace with your actual image component)
const LoginIllustration = () => (
  <div className="hidden lg:flex items-center justify-center w-full h-full p-12 relative">
    {/* Placeholder for the illustration from the image */}
    <div className="absolute top-0 left-0 right-0 bottom-0">
      {/* The background is solid in the image, so this acts as a spacer/holder */}
    </div>
    {/* You should replace this entire div content with an <img> tag 
        or Next.js <Image /> component pointing to your 'Log in.png' illustration. */}
    <div className="flex flex-col items-center">
      <span className="text-8xl font-serif text-primary">AI</span>
      <p className="text-xl text-white mt-4 italic">Streamline your workflow</p>
    </div>
  </div>
);
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // --- Best Practice: Client-side validation ---
    if (!email || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    // --- Best Practice: API Call Simulation ---
    try {
      // Replace with actual API call (e.g., fetch('/api/login', {...}))
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Check credentials (Simulated)
      if (email === "example@gmail.com" && password === "password123") {
        // Successful login logic (e.g., redirect, store token)
        console.log("Login successful!");
      } else {
        // API response error
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const PasswordToggleIcon = showPassword ? EyeOff : Eye;

  return (
    // Main container with full screen height and theme background
    <div className="min-h-screen flex items-center justify-center bg-BG">
      <div className="max-w-7xl mx-auto flex w-full min-h-screen lg:min-h-[700px]">
        {/* Left Side: Illustration */}
        <div className="w-1/2 bg-gray-900 hidden lg:block border-r border-gray-700/50">
          <LoginIllustration />
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-sm">
            <header className="mb-8 text-center lg:text-left">
              <h1 className="text-4xl font-bold text-text_color">
                Welcome <span className="text-primary">back</span>
              </h1>
              <p className="text-sm mt-1 text-gray">
                Sign in to streamline your shipping workflow
              </p>
            </header>

            {/* Google Login Button */}
            <button
              onClick={() => console.log("Continue with Google")}
              className="w-full flex items-center justify-center p-3 rounded-md transition duration-200 border text-base font-medium bg-secondary border-element text-text_color"
            >
              <FcGoogle className="w-5 h-5 mr-3" />
              Continue with Google
            </button>

            {/* OR Separator */}
            <div className="flex items-center my-6">
              <div className="grow border-t border-element"></div>
              <span className="mx-4 text-xs uppercase text-gray">or</span>
              <div className="grow border-t border-element"></div>
            </div>

            {/* Error Message Display */}
            {error && (
              <div className="flex items-center p-3 mb-4 rounded-md text-sm font-medium bg-[#FF573330] text-[#FF5733]">
                <AlertCircle className="w-4 h-4 mr-2" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="relative">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2 text-text_color"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 pr-10 rounded-md border text-base focus:ring-2 focus:ring-opacity-50 transition duration-150 bg-element border-element text-text_color hover:ring-primary"
                  required
                />
                <Mail className="absolute right-3 top-[50px] transform -translate-y-1/2 w-5 h-5 text-text_color" />
              </div>

              {/* Password Field */}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 pr-10 rounded-md border text-base focus:ring-2 focus:ring-opacity-50 transition duration-150 bg-element border-element text-text_color hover:ring-primary"
                  required
                />
                <PasswordToggleIcon
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[50px] transform -translate-y-1/2 w-5 h-5 cursor-pointer text-gray"
                />
              </div>

              {/* Remember Me and Forgot Password */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded cursor-pointer bg-element border-gray accent-primary hover:ring-primary"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm cursor-pointer text-text_color"
                  >
                    Remember me
                  </label>
                </div>

                <a
                  href="#"
                  className="text-sm font-medium hover:underline text-primary"
                >
                  Forgot password
                </a>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center p-3 rounded-md bg-primary text-text_color text-base font-semibold transition duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            {/* Sign Up Link and Legal */}
            <div className="mt-8 text-center text-sm text-gray">
              Don't have an account?{" "}
              <a
                href="#"
                className="font-semibold hover:underline text-primary"
              >
                Sign up for free
              </a>
            </div>

            <div className="mt-4 text-center text-xs text-gray">
              By signing in, you agree to our{" "}
              <a href="#" className="hover:underline text-primary">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="hover:underline text-primary">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
