"use client";

import { useState } from "react";
import { toast } from "react-toastify";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const SubmitEmail = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email.");
    } else {
      toast.success("Reset link sent to your email.");
    }
  };

  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
      <div className="w-full max-w-xl">
        <header className="mb-12 text-center">
          <h1 className="text-2xl md:text-3xl lg:text-[40px] font-bold text-text_color font-lora ">
            Forgot your password
          </h1>
          <p className="text-sm mt-4 text-gray max-w-11/12 mx-auto">
            No worries! Enter your email and we’ll send you a reset code
          </p>
        </header>

        <form onSubmit={SubmitEmail} className="space-y-4">
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
          <p className="text-sm my-4 text-gray max-w-11/12 mx-auto">
            Enter the email address associated with your Boomerang.study
            account.
          </p>
          {/* reset login button */}
          <button
            type="submit"
            disabled={!email}
            className="w-full flex items-center justify-center p-4 rounded-xl bg-primary text-text_color text-base font-semibold transition duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            Sent Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}
