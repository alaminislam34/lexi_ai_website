"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import SentResetLink from "../../../(auth)/login/components/SentResetLink";

import { ADMIN_LOGIN, PROFILE_DETAILS } from "../../../../api/apiEntpoint";
import baseApi from "../../../../api/base_url";
import Cookies from "js-cookie";

const clearAllAuthTokens = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("adminToken");
  localStorage.removeItem("user");
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
  Cookies.remove("adminAccessToken");
  Cookies.remove("adminRefreshToken");
};

const getLoginErrorMessage = (error) => {
  if (error?.code === "ECONNABORTED") {
    return "Request timed out. Please check your connection and try again.";
  }

  if (!error?.response) {
    return "Unable to reach the server. Please check your internet or VPN and try again.";
  }
  //!remove
  const status = error.response.status;
  const data = error.response.data;
  const apiMessage =
    data?.detail ||
    data?.message ||
    data?.error ||
    (Array.isArray(data?.non_field_errors) ? data.non_field_errors[0] : "") ||
    (Array.isArray(data?.email) ? data.email[0] : "") ||
    (Array.isArray(data?.password) ? data.password[0] : "");

  if (status === 400) {
    return apiMessage || "Please enter a valid email and password.";
  }

  if (status === 401) {
    return apiMessage || "Incorrect email or password.";
  }

  if (status === 403) {
    return apiMessage || "You are not authorized to access the admin panel.";
  }

  if (status === 429) {
    return (
      apiMessage || "Too many attempts. Please wait a moment and try again."
    );
  }

  if (status >= 500) {
    return "Server error. Please try again in a few minutes.";
  }

  return apiMessage || "Login failed. Please try again.";
};

export default function Login() {
  const [forget, setForget] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const PasswordToggleIcon = showPassword ? EyeOff : Eye;
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    try {
      if (!email || !password) {
        const message = "Please enter both email and password.";
        setLoginError(message);
        toast.error(message);
        return;
      }

      setLoading(true);
      const response = await baseApi.post(
        `${ADMIN_LOGIN}`,
        {
          email: email.trim(),
          password,
          remember_me: rememberMe ? "true" : "false",
        },
        {
          timeout: 15000,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const accessToken = response?.data?.access;
      const refreshToken = response?.data?.refresh;

      if (!accessToken || !refreshToken) {
        throw new Error("Invalid login response: missing auth tokens.");
      }

      const profileResponse = await baseApi.get(`${PROFILE_DETAILS}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const loggedInUser = profileResponse?.data;

      if (loggedInUser?.role !== "admin") {
        clearAllAuthTokens();
        const message = "Only admin users can access the admin panel.";
        setLoginError(message);
        toast.error(message);
        return;
      }

      localStorage.setItem(
        "token",
        JSON.stringify({
          accessToken,
          refreshToken,
        }),
      );

      localStorage.setItem(
        "adminToken",
        JSON.stringify({
          accessToken,
          refreshToken,
        }),
      );
      Cookies.set("accessToken", accessToken);
      Cookies.set("refreshToken", refreshToken);
      Cookies.set("adminAccessToken", accessToken);
      Cookies.set("adminRefreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(loggedInUser));

      router.push("/admin");
      toast.success("Logged in successfully!");
    } catch (error) {
      console.error("Admin login failed:", error);
      const message = getLoginErrorMessage(error);
      setLoginError(message);
      toast.error(message);
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

              <form onSubmit={handleLogin} className="space-y-4">
                {loginError ? (
                  <div
                    role="alert"
                    className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {loginError}
                  </div>
                ) : null}

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
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (loginError) setLoginError("");
                    }}
                    className="w-full p-3 pr-10 rounded-xl border text-base focus:ring-2 focus:ring-opacity-50 transition duration-150 bg-element border-element text-text_color hover:ring-primary"
                    disabled={loading}
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
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (loginError) setLoginError("");
                    }}
                    className="w-full p-3 pr-10 rounded-xl border text-base focus:ring-2 focus:ring-opacity-50 transition duration-150 bg-element border-element text-text_color hover:ring-primary"
                    disabled={loading}
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
                      disabled={loading}
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
                    disabled={loading}
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
            </div>
          </div>
        ) : (
          <SentResetLink setForget={setForget} />
        )}
      </div>
    </div>
  );
}
