"use client";

import React, { useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import Link from "next/link";

const SelectWrapper = ({ value, onChange, children, inputClasses }) => (
  <div className="relative">
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

const AskCasezyForm = ({
  state,
  setState,
  zip,
  setZip,
  practiceArea,
  setPracticeArea,
  description,
  setDescription,
  handleSubmit,
  loading,
  error,
  inputClasses,
}) => (
  <div className="w-full max-w-5xl mx-auto md:mx-0">
    <header className="mb-8 md:mb-12 space-y-2">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
        Ask Casezy
      </h1>
      <p className="text-base text-gray-400">
        Demo only — general legal information, not legal advice.
      </p>
    </header>

    <div className={`rounded-xl bg-secondary p-6 md:p-8`}>
      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 p-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="state"
            className="block text-sm font-semibold mb-2 text-gray-300"
          >
            State
          </label>
          <SelectWrapper
            value={state}
            onChange={(e) => setState(e.target.value)}
            inputClasses={inputClasses}
          >
            <option value="Michigan">Michigan</option>
            <option value="California">California</option>
            <option value="New York">New York</option>
            <option value="Texas">Texas</option>
          </SelectWrapper>
        </div>

        <div>
          <label
            htmlFor="zip"
            className="block text-sm font-semibold mb-2 text-gray-300"
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

        <div>
          <label
            htmlFor="practiceArea"
            className="block text-sm font-semibold mb-2 text-gray-300"
          >
            Case type
          </label>
          <SelectWrapper
            value={practiceArea}
            onChange={(e) => setPracticeArea(e.target.value)}
            inputClasses={inputClasses}
          >
            <option value="Criminal">Criminal</option>
            <option value="Family">Family Law</option>
            <option value="RealEstate">Real Estate</option>
            <option value="Civil">Civil Litigation</option>
          </SelectWrapper>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-semibold mb-2 text-gray-300"
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

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center p-4 rounded-lg text-white bg-primary text-lg font-bold transition duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed mt-8 shadow-lg shadow-blue-500/30"
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
);

const CasezyChatInterface = ({ state, practiceArea }) => {
  const sessionDetail = `${state} - ${practiceArea}${
    practiceArea === "Family" ? " (Divorce, Custody)" : ""
  }`;

  const mockMessages = [
    {
      text: "Not legal advice. I can share general information and next steps.",
      role: "ai",
    },
    {
      text: `Summary for ${practiceArea}${
        practiceArea === "Family" ? " (Divorce, Custody)" : ""
      } in ${state}. Laws vary by county.`,
      role: "ai",
    },
    { text: "When is your court date or any deadline (approx)?", role: "ai" },
  ];

  return (
    <div className="w-full">
      <header className="mb-6 space-y-1">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white leading-tight">
          Casezy Chat
        </h1>

        <p className="text-base text-gray">Session · {sessionDetail}</p>
      </header>

      <div className={`space-y-8 bg-secondary rounded-2xl p-6 lg:p-8`}>
        <div className="space-y-4 bg-[#1B1D22] p-6 rounded-2xl">
          {mockMessages.map((msg, index) => (
            <div key={index} className={``}>
              <button className="w-full lg:w-1/2 text-left p-3 md:p-4 rounded-xl text-white text-base shadow-sm bg-element">
                {" "}
                {msg.text}
              </button>
            </div>
          ))}
        </div>

        <div className="flex space-x-4 pt-4">
          <input
            type="text"
            placeholder="Type your answer...."
            className="grow p-4 rounded-xl text-white text-base border-none focus:ring-2 bg-[#12151B] focus:ring-blue-500 focus:outline-none"
          />
          <button className="shrink-0 w-24 flex items-center justify-center rounded-xl text-white text-lg font-semibold transition duration-300 hover:opacity-90 bg-primary">
            Send
          </button>
        </div>

        <div className="flex space-x-4 pt-4">
          <Link
            href={"/attorneys"}
            className="py-3 px-5 rounded-lg text-white text-sm font-medium transition duration-300 hover:opacity-90 bg-primary"
          >
            Browse attorneys
          </Link>
          <button className="py-3 px-5 rounded-lg text-white text-sm font-medium border border-gray transition duration-300 hover:bg-gray-700">
            View Sources
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Ask_Casezy_Client() {
  const [state, setState] = useState("Michigan");
  const [zip, setZip] = useState("48226");
  const [practiceArea, setPracticeArea] = useState("Family");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatInitiated, setChatInitiated] = useState(false);

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

    console.log({ state, zip, practiceArea, description });

    setTimeout(() => {
      setLoading(false);
      setChatInitiated(true);
    }, 2000);
  };

  const inputClasses =
    "w-full p-4 border-none rounded-lg text-white text-base focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-500 appearance-none shadow-inner bg-[#12151B]";

  return (
    <div className="min-h-screen pt-24 lg:pt-28 max-w-[1440px] mx-auto w-11/12 text-white flex justify-center">
      <div className="w-full">
        {chatInitiated ? (
          <CasezyChatInterface state={state} practiceArea={practiceArea} />
        ) : (
          <AskCasezyForm
            state={state}
            setState={setState}
            zip={zip}
            setZip={setZip}
            practiceArea={practiceArea}
            setPracticeArea={setPracticeArea}
            description={description}
            setDescription={setDescription}
            handleSubmit={handleSubmit}
            loading={loading}
            error={error}
            inputClasses={inputClasses}
          />
        )}
      </div>
    </div>
  );
}
