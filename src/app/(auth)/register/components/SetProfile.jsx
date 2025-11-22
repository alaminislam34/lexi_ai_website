"use client";

import React from "react";

export default function SetProfile() {
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



        <form className="space-y-4">
          {/* Email Field */}
          <div className="relative">
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-2 text-text_color"
            >
              Password
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
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold hover:underline text-primary"
          >
            Log in
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
  );
}
