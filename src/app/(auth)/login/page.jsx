"use client";

import React, { useState } from "react";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
import Link from "next/link";
import SentResetLink from "./components/SentResetLink";
import { useAuth } from "@/app/providers/Auth_Providers/AuthProviders";
import { toast } from "react-toastify";
import axios from "axios";
import baseApi from "@/api/base_url";
import { LOGIN } from "@/api/apiEntpoint";
import { useRouter } from "next/navigation";

export default function Login() {
  const [forget, setForget] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const PasswordToggleIcon = showPassword ? EyeOff : Eye;
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (!email || !password) {
        toast.error("Please enter both email and password.");
        return;
      }
      setLoading(true);
      const res = await axios.post(`http://10.10.7.19:8001${LOGIN}`, {
        email,
        password,
        remember_me: rememberMe ? "true" : "false",
      });
      if (res.status === 200) {
        toast.success("Logged in successfully!");
      }
      localStorage.setItem(
        "token",
        JSON.stringify({
          accessToken: res.data.access,
          refreshToken: res.data.refresh,
        }),
      );
      router.push("/");
    } catch (error) {
      console.log(error);
      toast.error(
        "An error occurred while logging in. Please check your credentials and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-BG">
      <div className="max-w-[1440px] w-11/12 mx-auto flex flex-col lg:flex-row justify-center items-center gap-12 min-h-screen lg:min-h-[700px]">
        <div className="w-1/2 hidden lg:flex flex-col gap-6 justify-center items-center">
          <h1 className="text-2xl md:text-3xl lg:text-[40px] font-semibold text-primary font-lora mt-10">
            Casezys
          </h1>
          <br />
          <Image
            src={"/images/log_in.jpg"}
            height={465}
            width={500}
            alt="Avatar image"
          />
        </div>

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

              <button
                onClick={() => console.log("Continue with Google")}
                className="w-full flex items-center justify-center p-3 rounded-xl transition duration-200 border text-base font-medium bg-secondary border-element text-text_color"
              >
                <FcGoogle className="w-5 h-5 mr-3" />
                Continue with Google
              </button>

              <div className="flex max-w-32 mx-auto items-center justify-center my-6">
                <div className="grow border-t border-element"></div>
                <span className="mx-4 text-gray">or</span>
                <div className="grow border-t border-element"></div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
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
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 pr-10 rounded-xl border text-base focus:ring-2 focus:ring-opacity-50 transition duration-150 bg-element border-element text-text_color hover:ring-primary"
                    required
                  />
                </div>

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

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded cursor-pointer bg-element border-gray accent-primary hover:ring-primary"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm cursor-pointer text-text_color"
                    >
                      Remember me
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={() => setForget(true)}
                    className="text-sm font-medium hover:underline text-primary"
                  >
                    Forgot password
                  </button>
                </div>

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

              <div className="mt-8 text-center text-sm text-gray">
                Don&apos;t have an account?{" "}
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
          <SentResetLink setForget={setForget} />
        )}
      </div>
    </div>
  );
}
