"use client";

import { StateContext } from "@/app/providers/StateProvider";
import Image from "next/image";
import { useContext } from "react";

export default function Step_3() {
  // All necessary state and handler are destructured here:
  const { setArea, location, setLocation, area, SubmitProfile } =
    useContext(StateContext);

  return (
    // Main container with full screen height and theme background
    <div className="min-h-screen flex items-center justify-center bg-BG">
      <div className="max-w-[1440px] w-11/12 mx-auto flex flex-col lg:flex-row justify-center items-center gap-12 min-h-screen lg:min-h-[700px]">
        {/* Left Side: Illustration */}
        <div className="w-1/2 flex flex-col gap-6 justify-center items-center">
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
                Set your Profile
              </h1>

              <p className="text-sm mt-4 text-gray max-w-11/12 mx-auto">
                Complete your profile to find the right attorney and get legal
                guidance effortlessly.{" "}
              </p>
            </header>

            {/* The form submits using the SubmitProfile handler from context. */}

            <form onSubmit={SubmitProfile} className="space-y-4">
              {/* Location Field */}
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium mb-2 text-text_color"
                >
                  Location
                </label>

                <input
                  type="text"
                  id="location"
                  placeholder="enter your location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-3 pr-10 rounded-xl border text-base focus:ring-2 focus:ring-opacity-50 transition duration-150 bg-element border-element text-text_color hover:ring-primary"
                  required
                />
              </div>
              {/* Area Field */}
              <div className="relative">
                <label
                  htmlFor="area"
                  className="block text-sm font-medium mb-2 text-text_color"
                >
                  Preferred Legal Area
                </label>

                <input
                  type="text"
                  id="area"
                  placeholder="enter your preferred area"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full p-3 pr-10 rounded-xl border text-base focus:ring-2 focus:ring-opacity-50 transition duration-150 bg-element border-element text-text_color hover:ring-primary"
                  required
                />
              </div>
              {/* Continue Button */}
              <button
                type="submit"
                disabled={!location || !area}
                className="w-full flex items-center justify-center p-4 rounded-xl bg-primary text-text_color text-base font-semibold transition duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                Continue
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
