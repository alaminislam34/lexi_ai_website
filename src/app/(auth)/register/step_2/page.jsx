"use client";

import { useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { StateContext } from "@/app/providers/StateProvider";
import { toast } from "react-toastify";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Step_2() {
  // 3. Use useContext to access state and handler
  const { setUserData } = useContext(StateContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const router = useRouter();
  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (!name || !email || !gender) {
        toast.error("Please fill in all required fields.");
        return;
      }
      setUserData({ name, email, gender });
      router.push("/register/step_3");
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
                Create your account
              </h1>
              <p className="text-sm mt-4 text-gray max-w-11/12 mx-auto">
                Join now to get expert legal advice instantly and manage your
                consultations with ease.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2 text-text_color"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter your name"
                  className="w-full p-3 pr-10 rounded-xl border text-base focus:ring-2 focus:ring-opacity-50 transition duration-150 bg-element border-element text-text_color hover:ring-primary"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* gender Field */}
              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium mb-2 text-text_color"
                >
                  Gender
                </label>
                <input
                  type="text"
                  id="gender"
                  placeholder="Enter your gender"
                  className="w-full p-3 pr-10 rounded-xl border text-base focus:ring-2 focus:ring-opacity-50 transition duration-150 bg-element border-element text-text_color hover:ring-primary"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                />
              </div>

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
                  className="w-full p-3 pr-10 rounded-xl border text-base focus:ring-2 focus:ring-opacity-50 transition duration-150 bg-element border-element text-text_color hover:ring-primary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={!email || !name || !gender}
                className="w-full flex items-center justify-center p-4 rounded-xl bg-primary text-text_color text-base font-semibold transition duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                Continue
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
          </div>
        </div>
      </div>
    </div>
  );
}
