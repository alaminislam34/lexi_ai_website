"use client";

import React, { useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";

export default function Ask_Casezy() {
  // Mock state for form inputs
  const [state, setState] = useState("Michigan");
  const [zip, setZip] = useState("48226");
  const [practiceArea, setPracticeArea] = useState("Criminal");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!state || !practiceArea || !description) {
      setError(
        "Please fill out all required fields (State, Practice area, Description)."
      );
      return;
    }

    setLoading(true);
    setError(null);

    // Simulated API call for analysis
    console.log({ state, zip, practiceArea, description });
    setTimeout(() => {
      setLoading(false);
      alert("Analysis complete! Chat session initiated.");
      // In a real app, you would navigate to the chat page here
    }, 2000);
  };

  // Common Tailwind classes for inputs
  const inputClasses =
    "w-full p-4 border-none rounded-lg text-white text-base " +
    "focus:ring-2 focus:ring-primary focus:outline-none " +
    "bg-[#12151B] placeholder-gray-500 appearance-none";

  // Custom styled select wrapper to position the chevron icon
  const SelectWrapper = ({ value, onChange, children }) => (
    <div className="relative ">
      <select
        value={value}
        onChange={onChange}
        className={`${inputClasses} appearance-none cursor-pointer pr-10`}
      >
        {children}
      </select>
      <ChevronDown className="absolute z-0 right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
    </div>
  );

  return (
    // Outer container: Full viewport height, dark background, limited width
    // max-w-7xl (Tailwind default for 1280px, fitting the spirit of 1440px constraint)
    <div className="pt-24 lg:pt-28 min-h-screen max-w-[1440px] mx-auto w-11/12 text-white">
      <div className="w-full max-w-5xl">
        {" "}
        {/* Max width container */}
        {/* Header Section */}
        <header className="mb-8 md:mb-12 space-y-2">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold  leading-[26px] py-4 lg:py-6">
            Ask Casezy
          </h1>
          <p className="text-base text-gray">
            Demo only — general legal information, not legal advice.
          </p>
        </header>
        {/* Form Card */}
        <div className="rounded-xl bg-secondary p-6">
          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 p-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* State Selection */}
            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium mb-2 text-gray-300 "
              >
                State
              </label>
              <SelectWrapper
                value={state}
                onChange={(e) => setState(e.target.value)}
              >
                <option value="Michigan">Michigan</option>
                <option value="California">California</option>
                <option value="New York">New York</option>
                <option value="Texas">Texas</option>
              </SelectWrapper>
            </div>

            {/* ZIP (Optional) Input */}
            <div>
              <label
                htmlFor="zip"
                className="block text-sm font-medium mb-2 text-gray-300"
              >
                ZIP (Optional)
              </label>
              <input
                type="text"
                id="zip"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                className={inputClasses}
                placeholder="e.g., 48226"
              />
            </div>

            {/* Practice Area Selection */}
            <div>
              <label
                htmlFor="practiceArea"
                className="block text-sm font-medium mb-2 text-gray-300"
              >
                Practice area
              </label>
              <SelectWrapper
                value={practiceArea}
                onChange={(e) => setPracticeArea(e.target.value)}
              >
                <option value="Criminal">Criminal</option>
                <option value="Family">Family Law</option>
                <option value="RealEstate">Real Estate</option>
                <option value="Civil">Civil Litigation</option>
              </SelectWrapper>
            </div>

            {/* What Happened? Textarea */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-2 text-gray-300"
              >
                What happened?
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`${inputClasses} resize-none h-32`}
                placeholder="Briefly describe your situation (no sensitive details)"
                required
              />
            </div>

            {/* Submit Button (Primary Color) */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center p-4 rounded-lg bg-primary text-white text-lg font-semibold transition duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed mt-8 shadow-lg shadow-primary/30"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze & Start Chat"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
