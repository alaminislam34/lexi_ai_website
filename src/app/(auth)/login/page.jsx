"use client";

import React, { useState } from "react";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
import Link from "next/link";
import ForgetPassword from "./components/SentResetLink";

export default function Login() {
  const [forget, setForget] = useState(false);
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
      <div className="max-w-[1440px] w-11/12 mx-auto flex flex-col lg:flex-row justify-center items-center gap-12 min-h-screen lg:min-h-[700px]">
        {/* Left Side: Illustration */}
        <div className="w-1/2 flex flex-col gap-6 justify-center items-center">
          <h1 className="text-2xl md:text-3xl lg:text-[40px] font-semibold text-text_color font-lora mt-10">
            LexiLink <span className="text-primary">AI</span>
          </h1>
          <br />
          <Image
            src={"/images/log_in.jpg"}
            height={465}
            width={500}
            alt="Avatar image"
          />
        </div>

        {/* Right Side: Login Form */}
        {!forget ? (
          <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
            <div className="w-full max-w-xl">
              <header className="mb-12 text-center">
                <h1 className="text-2xl md:text-3xl lg:text-[40px] font-bold text-text_color font-lora ">
                  Welcome <span className="text-primary">back</span>
                </h1>
                <p className="text-sm mt-4 text-gray max-w-11/12 mx-auto">
                  Sign in to connect with trusted attorneys quickly and securely
                </p>
              </header>

              {/* Google Login Button */}
              <button
                onClick={() => console.log("Continue with Google")}
                className="w-full flex items-center justify-center p-3 rounded-xl transition duration-200 border text-base font-medium bg-secondary border-element text-text_color"
              >
                <FcGoogle className="w-5 h-5 mr-3" />
                Continue with Google
              </button>

              {/* OR Separator */}
              <div className="flex max-w-32 mx-auto items-center justify-center my-6">
                <div className="grow border-t border-element"></div>
                <span className="mx-4 text-gray">or</span>
                <div className="grow border-t border-element"></div>
              </div>

              {/* Error Message Display */}
              {error && (
                <div className="flex items-center p-3 mb-4 rounded-xl text-sm font-medium bg-[#FF573330] text-[#FF5733]">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div>
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
                    className="w-full p-3 pr-10 rounded-xl border text-base focus:ring-2 focus:ring-opacity-50 transition duration-150 bg-element border-element text-text_color hover:ring-primary"
                    required
                  />
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
                    className="w-full p-3 pr-10 rounded-xl border text-base focus:ring-2 focus:ring-opacity-50 transition duration-150 bg-element border-element text-text_color hover:ring-primary"
                    required
                  />
                  <PasswordToggleIcon
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[53px] transform -translate-y-1/2 w-5 h-5 cursor-pointer text-gray"
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

                  <button
                    onClick={() => setForget(true)}
                    className="text-sm font-medium hover:underline text-primary"
                  >
                    Forgot password
                  </button>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center p-4 rounded-xl bg-primary text-text_color text-base font-semibold transition duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
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
                <Link
                  href="/register"
                  className="font-semibold hover:underline text-primary"
                >
                  Sign up for free
                </Link>
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
        ) : (
          <ForgetPassword />
        )}
      </div>
    </div>
  );
}
