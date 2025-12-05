"use client";

import React, { useContext } from "react";
import Image from "next/image";
import { StateContext } from "@/app/providers/StateProvider";

export default function Step_1() {
  // 1. Destructure handleSetRole instead of setStep and setRole
  const { handleSetRole } = useContext(StateContext);

  return (
    // Main container with full screen height and theme background
    <div className="min-h-screen flex items-center justify-center bg-BG">
      <div className="max-w-[1440px] w-11/12 mx-auto flex flex-col lg:flex-row justify-center items-center gap-12 min-h-screen lg:min-h-[700px]">
        <div className="w-1/2 flex flex-col gap-6 justify-center items-center">
          <h1 className="text-2xl md:text-3xl lg:text-[40px] font-semibold text-primary font-lora mt-10">
            Casezys
          </h1>

          <Image
            src={"./images/log_in.jpg"}
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
                Sign up as
              </h1>

              <p className="text-sm mt-4 text-gray max-w-11/12 mx-auto">
                Sign in to connect with trusted attorneys quickly and securely
              </p>
            </header>

            <div className="space-y-4">
              <button
                onClick={() => {
                  // 2. Use the unified handler for 'client'
                  handleSetRole("client");
                }}
                className="w-full flex items-center justify-center p-4 rounded-xl bg-primary text-text_color text-base font-semibold transition duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                Client
              </button>

              <button
                onClick={() => {
                  // 3. Use the unified handler for 'attorney'
                  handleSetRole("attorney");
                }}
                className="w-full flex items-center justify-center p-4 rounded-xl bg-primary text-text_color text-base font-semibold transition duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                Attorney
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
