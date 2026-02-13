"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Loader2, ArrowLeft } from "lucide-react";

export default function SentResetLink({ setForget }) {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [loading, setLoading] = useState(false);

  // States for data
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [passwords, setPasswords] = useState({
    new_password: "",
    confirm_password: "",
  });

  const BASE_URL = "http://3.141.14.219:8000";

  // Step 1: Send OTP to Email
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/password/forgot/`, {
        email,
      });
      if (res.status === 200 || res.status === 201) {
        toast.success("OTP sent to your email!");
        setStep(2);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.detail || "Failed to send OTP. Check email.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // এই API টি আপনার দেওয়া তথ্য অনুযায়ী otp এবং email নিয়ে reset_token রিটার্ন করবে
      const res = await axios.post(
        `${BASE_URL}/api/auth/password/reset/verify/`,
        {
          email,
          otp,
        },
      );

      if (res.data.reset_token) {
        setResetToken(res.data.reset_token);
        toast.success("OTP Verified!");
        setStep(3);
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Confirm New Password
  const handleConfirmReset = async (e) => {
    e.preventDefault();
    if (passwords.new_password !== passwords.confirm_password) {
      return toast.error("Passwords do not match!");
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/api/auth/password/reset/confirm/`,
        {
          reset_token: resetToken,
          new_password: passwords.new_password,
          new_password_confirm: passwords.confirm_password,
        },
      );
      console.log(res);

      toast.success("Password changed successfully!");
      setTimeout(() => {
        setForget(false);
        router.push("/login");
      }, 2000);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.detail || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
      <div className="w-full max-w-xl">
        {/* Back Button */}
        <button
          onClick={() => (step === 1 ? setForget(false) : setStep(step - 1))}
          className="flex items-center text-gray-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft size={18} className="mr-2" /> Back
        </button>

        <header className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl lg:text-[32px] font-bold text-text_color font-lora">
            {step === 1 && "Forgot Password"}
            {step === 2 && "Verify OTP"}
            {step === 3 && "Set New Password"}
          </h1>
          <p className="text-sm mt-3 text-gray max-w-xs mx-auto">
            {step === 1 && "Enter your email to receive a password reset code."}
            {step === 2 && `Enter the code sent to ${email}`}
            {step === 3 && "Create a strong password for your account."}
          </p>
        </header>

        {/* STEP 1: EMAIL FORM */}
        {step === 1 && (
          <form onSubmit={handleSendOTP} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-text_color">
                Email Address
              </label>
              <input
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 rounded-xl border bg-element border-element text-white focus:ring-2 focus:ring-primary outline-none transition"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || !email}
              className="w-full flex items-center justify-center p-4 rounded-xl bg-primary text-white font-semibold hover:opacity-90 disabled:opacity-50 transition"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Send Reset Code"
              )}
            </button>
          </form>
        )}

        {/* STEP 2: OTP VERIFY FORM */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-text_color">
                OTP Code
              </label>
              <input
                type="text"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-4 rounded-xl border bg-element border-element text-white text-center text-xl tracking-widest focus:ring-2 focus:ring-primary outline-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || otp.length < 4}
              className="w-full flex items-center justify-center p-4 rounded-xl bg-primary text-white font-semibold hover:opacity-90 disabled:opacity-50 transition"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Verify Code"}
            </button>
          </form>
        )}

        {/* STEP 3: NEW PASSWORD FORM */}
        {step === 3 && (
          <form onSubmit={handleConfirmReset} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-text_color">
                New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={passwords.new_password}
                onChange={(e) =>
                  setPasswords({ ...passwords, new_password: e.target.value })
                }
                className="w-full p-4 rounded-xl border bg-element border-element text-white focus:ring-2 focus:ring-primary outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-text_color">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={passwords.confirm_password}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    confirm_password: e.target.value,
                  })
                }
                className="w-full p-4 rounded-xl border bg-element border-element text-white focus:ring-2 focus:ring-primary outline-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || !passwords.new_password}
              className="w-full flex items-center justify-center p-4 rounded-xl bg-primary text-white font-semibold hover:opacity-90 disabled:opacity-50 transition"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Update Password"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
