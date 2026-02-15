"use client";

import { REGISTER } from "@/api/apiEntpoint";
import { StateContext } from "@/app/providers/StateProvider";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useContext } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Loader2, ShieldCheck, ArrowLeft } from "lucide-react"; // Added for better UI
import { toast } from "react-toastify";

const PasswordToggleIcon = ({ onClick, className, isVisible }) => {
  const Icon = isVisible ? FaEyeSlash : FaEye;
  return <Icon onClick={onClick} className={className} />;
};

export default function Step_4() {
  const { setUserData, userData } = useContext(StateContext);
  const [step, setStep] = useState("password"); // 'password' or 'otp'
  const [loading, setLoading] = useState(false);

  // Form States
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");

  const router = useRouter();

  // Step 1: Handle Registration
  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...userData,
        password: password,
        password_confirm: confirmPassword,
      };

      setUserData(payload);

      const res = await axios.post(
        `http://10.10.7.19:8002${REGISTER}`,
        payload,
      );

      if (res.status === 200 || res.status === 201) {
        toast.success("Account created! Please verify your email.");
        setStep("otp");
      }
    } catch (error) {
      console.log(error);
      const errorMsg = error.response?.data?.detail || "Registration failed.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Handle OTP Verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "http://10.10.7.19:8002/api/auth/otp/verify/",
        {
          email: userData.email,
          otp: otp,
        },
      );

      if (res.status === 200 || res.status === 201) {
        toast.success("Email verified successfully!");
        router.push("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || "Invalid OTP code.");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full p-3 pr-10 rounded-xl border text-base focus:ring-2 focus:ring-opacity-50 transition duration-150 bg-element border-element text-text_color hover:ring-primary outline-none";
  const labelClasses = "block text-sm font-medium mb-2 text-text_color";

  return (
    <div className="min-h-screen flex items-center justify-center bg-BG">
      <div className="max-w-[1440px] w-11/12 mx-auto flex flex-col lg:flex-row justify-center items-center gap-12 min-h-screen lg:min-h-[700px]">
        {/* Left Side: Illustration */}
        <div className="w-1/2 hidden lg:flex flex-col gap-6 justify-center items-center">
          <h1 className="text-2xl md:text-3xl lg:text-[40px] font-semibold text-primary font-lora">
            Casezys
          </h1>
          <Image
            src="/images/log_in.jpg"
            height={465}
            width={500}
            alt="Avatar"
            className="max-w-[460px] h-auto rounded-2xl"
          />
        </div>

        {/* Right Side: Dynamic Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-xl">
            <header className="mb-12 text-center lg:text-left">
              {step === "otp" && (
                <button
                  onClick={() => setStep("password")}
                  className="flex items-center text-gray-400 hover:text-primary mb-4 transition"
                >
                  <ArrowLeft size={18} className="mr-2" /> Change Password
                </button>
              )}
              <h1 className="text-2xl md:text-3xl lg:text-[40px] font-bold text-text_color font-lora">
                {step === "password" ? "Set a Password" : "Verify OTP"}
              </h1>
              <p className="text-sm mt-4 text-gray">
                {step === "password"
                  ? "Set a strong password to keep your account secure"
                  : `Enter the code sent to ${userData.email}`}
              </p>
            </header>

            {step === "password" ? (
              /* --- PASSWORD FORM --- */
              <form onSubmit={handleRegister} className="space-y-6">
                <div className="relative">
                  <label className={labelClasses}>Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="***********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClasses}
                    required
                  />
                  <PasswordToggleIcon
                    onClick={() => setShowPassword(!showPassword)}
                    isVisible={showPassword}
                    className="absolute right-3 top-[50px] transform -translate-y-1/2 w-5 h-5 cursor-pointer text-gray"
                  />
                </div>

                <div className="relative">
                  <label className={labelClasses}>Confirm Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={inputClasses}
                    required
                  />
                  <PasswordToggleIcon
                    onClick={() => setShowPassword(!showPassword)}
                    isVisible={showPassword}
                    className="absolute right-3 top-[50px] transform -translate-y-1/2 w-5 h-5 cursor-pointer text-gray"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !password || !confirmPassword}
                  className="w-full flex items-center justify-center p-4 rounded-xl bg-primary text-text_color text-base font-semibold transition hover:opacity-90 disabled:opacity-50 mt-6"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Complete Registration"
                  )}
                </button>
              </form>
            ) : (
              /* --- OTP VERIFICATION FORM --- */
              <form
                onSubmit={handleVerifyOtp}
                className="space-y-6 animate-in fade-in duration-500"
              >
                <div className="bg-element p-4 rounded-xl border border-primary/20 flex items-center gap-4">
                  <ShieldCheck className="text-primary" size={32} />
                  <p className="text-xs text-gray">
                    Check your inbox for the 6-digit verification code.
                  </p>
                </div>

                <div>
                  <label className={labelClasses}>OTP Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className={`${inputClasses} text-center text-2xl tracking-[0.5em] font-bold`}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="w-full flex items-center justify-center p-4 rounded-xl bg-primary text-text_color text-base font-semibold transition hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Verify & Login"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
