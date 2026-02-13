"use client";

import React, { useContext, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import { StateContext } from "@/app/providers/StateProvider";
import { Loader2, ArrowLeft } from "lucide-react";

export default function AttorneyRegisterPage() {
  const { setUserData } = useContext(StateContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // আপনার দেওয়া JSON ফরম্যাট অনুযায়ী স্টেট
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password_confirm: "",
    full_name: "",
    role: "attorney",
    designation: "",
    area_of_law: "",
    gender: "male",
    location: "",
    preferred_legal_area: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.password_confirm) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://3.141.14.219:8000/api/auth/register/",
        formData,
      );

      if (response.status === 201 || response.status === 200) {
        toast.success("Attorney account created! Redirecting to login...");
        setTimeout(() => router.push("/login"), 2000);
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.detail || "Registration failed. Check your data.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full p-3 pr-10 rounded-xl border text-base focus:ring-2 focus:ring-opacity-50 transition duration-150 bg-element border-element text-text_color hover:ring-primary outline-none";
  const labelClasses = "block text-sm font-medium mb-2 text-text_color";

  return (
    <div className="min-h-screen flex items-center justify-center bg-BG">
      <div className="max-w-[1440px] w-11/12 mx-auto flex flex-col lg:flex-row justify-center items-center gap-12 min-h-screen lg:min-h-[800px] py-10">
        <div className="w-full lg:w-1/2 hidden lg:flex flex-col gap-6 justify-center items-center">
          <h1 className="text-2xl md:text-3xl lg:text-[40px] font-semibold text-primary font-lora">
            Casezys
          </h1>
          <div className="relative w-full max-w-[500px]">
            <Image
              src="/images/log_in.jpg"
              height={465}
              width={500}
              alt="Attorney Register"
              className="w-full h-auto rounded-2xl"
              priority
            />
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-4">
          <div className="w-full max-w-xl">
            <header className="mb-8 text-center lg:text-left">
              <button
                onClick={() => router.back()}
                className="flex items-center text-gray-400 hover:text-primary mb-4 transition"
              >
                <ArrowLeft size={18} className="mr-2" /> Back
              </button>
              <h1 className="text-2xl md:text-3xl lg:text-[40px] font-bold text-text_color font-lora">
                Attorney Profile Setup
              </h1>
              <p className="text-sm mt-4 text-gray">
                Complete your professional profile to join our network.
              </p>
            </header>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Full Name</label>
                  <input
                    name="full_name"
                    type="text"
                    placeholder="John Doe"
                    onChange={handleChange}
                    className={inputClasses}
                    required
                  />
                </div>
                <div>
                  <label className={labelClasses}>Email Address</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    onChange={handleChange}
                    className={inputClasses}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Password</label>
                  <input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    onChange={handleChange}
                    className={inputClasses}
                    required
                  />
                </div>
                <div>
                  <label className={labelClasses}>Confirm Password</label>
                  <input
                    name="password_confirm"
                    type="password"
                    placeholder="••••••••"
                    onChange={handleChange}
                    className={inputClasses}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Designation</label>
                  <input
                    name="designation"
                    type="text"
                    placeholder="e.g. Senior Lawyer"
                    onChange={handleChange}
                    className={inputClasses}
                    required
                  />
                </div>
                <div>
                  <label className={labelClasses}>Location</label>
                  <input
                    name="location"
                    type="text"
                    placeholder="e.g. Dhaka"
                    onChange={handleChange}
                    className={inputClasses}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Area of Law</label>
                  <input
                    name="area_of_law"
                    type="text"
                    placeholder="e.g. Criminal Law"
                    onChange={handleChange}
                    className={inputClasses}
                    required
                  />
                </div>
                <div>
                  <label className={labelClasses}>Preferred Area</label>
                  <input
                    name="preferred_legal_area"
                    type="text"
                    placeholder="e.g. Civil"
                    onChange={handleChange}
                    className={inputClasses}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={labelClasses}>Gender</label>
                <select
                  name="gender"
                  onChange={handleChange}
                  className={`${inputClasses} cursor-pointer appearance-none`}
                >
                  <option value="male" className="bg-[#12151B]">
                    Male
                  </option>
                  <option value="female" className="bg-[#12151B]">
                    Female
                  </option>
                  <option value="other" className="bg-[#12151B]">
                    Other
                  </option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center p-4 rounded-xl bg-primary text-text_color text-base font-semibold transition duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Complete Registration"
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-gray text-sm">
              Already have an account?{" "}
              <span
                onClick={() => router.push("/login")}
                className="text-primary cursor-pointer hover:underline"
              >
                Log in
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
