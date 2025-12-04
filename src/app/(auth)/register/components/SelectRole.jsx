import React from "react";

export default function SelectRole({ setRole, setStep }) {
  return (
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
              setStep(2);
              setRole("client");
            }}
            className="w-full flex items-center justify-center p-4 rounded-xl bg-primary text-text_color text-base font-semibold transition duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            Client
          </button>
          <button
            onClick={() => {
              setStep(2);
              setRole("attorney");
            }}
            className="w-full flex items-center justify-center p-4 rounded-xl bg-primary text-text_color text-base font-semibold transition duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            Attorney
          </button>
        </div>
      </div>
    </div>
  );
}
