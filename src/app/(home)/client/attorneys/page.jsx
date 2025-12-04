"use client";

import { ChevronDown, Loader2, Search, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

// অ্যাটর্নির ডেটা টাইপ ডিফাইন করা হয়েছে (যদিও এটি একটি জাভাস্ক্রিপ্ট ফাইল,
// পরিষ্কারের জন্য এটি রাখা হয়েছে)
/**
 * @typedef {object} Attorney
 * @property {string} image
 * @property {string} name
 * @property {number} score
 * @property {string} title
 * @property {string[]} practice_area
 * @property {string} description
 */

export const attorneys = [
  {
    image: "/images/user.jpg",
    name: "Jane Doe, Esq.",
    score: 3.7,
    title: "Describe your issue",
    practice_area: ["Criminal Defense", "DUI/OWI", "Expungement"],
    description: "Answer a few guided questions. No sensitive info required.",
  },
  {
    image: "/images/user.jpg",
    name: "John Smith, Esq.", // নাম পরিবর্তন করা হয়েছে
    score: 4.7,
    title: "Get general information",
    practice_area: ["Family Law", "Real Estate", "Civil Litigation"],
    description: "We cite official sources and explain options clearly.",
  },
  {
    image: "/images/user.jpg",
    name: "Jane Doe, Esq.",
    score: 5.0,
    title: "Connect to an attorney",
    practice_area: ["Criminal Defense", "DUI/OWI", "Expungement"],
    description: "Match with verified lawyers by practice area and ZIP.",
  },
];

// প্রয়োজনীয় ক্লাসের ডেফিনেশন (আগের কোড থেকে নেওয়া হয়েছে)
const inputClasses =
  "w-full p-4 border-none rounded-lg text-white text-base focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-500 appearance-none shadow-inner bg-[#12151B]";

const SelectWrapper = ({ children }) => (
  <div className="relative">
    <select className={`${inputClasses} appearance-none cursor-pointer pr-10`}>
      {children}
    </select>
    <ChevronDown className="absolute z-0 right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
  </div>
);

export const AttorneyProfileModal = ({ attorney, closeModal }) => {
  const profileData = {
    name: attorney.name,
    firm: "Doe Law PLLC",
    location: "Detroit, MI",
    score: 4.5,
    response_time: "~2 hrs",
    languages: ["English", "Spanish"],
    experience: "8+ years",
    practice_area: attorney.practice_area,
    image: attorney.image,
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-[#1D1F23] rounded-2xl shadow-2xl max-w-xl w-full relative overflow-hidden">
        <button
          onClick={closeModal}
          className="absolute top-4 left-4 z-10 text-white hover:text-gray-300 transition"
          aria-label="Close Modal"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Image
                src={profileData.image}
                height={80}
                width={80}
                alt={profileData.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-primary"
              />
              <div className="flex flex-col">
                <h2 className="text-xl font-bold text-white">
                  {profileData.name}
                </h2>
                <p className="text-sm text-gray-400">
                  {profileData.firm} • {profileData.location}
                </p>
              </div>
            </div>
            <div>
              <span className=" text-gray bg-element py-1 px-2 rounded-lg">
                {attorney.score.toFixed(2)}
              </span>
            </div>
          </div>

          <button className="w-full py-3 rounded-lg text-white font-medium transition duration-300 hover:opacity-90 bg-primary">
            Request Consult
          </button>

          <div className="space-y-2 pt-2">
            <p className="text-sm font-semibold text-gray-300">Area of law:</p>
            <div className="flex flex-wrap items-center gap-2">
              {profileData.practice_area.map((area, i) => (
                <span
                  key={i}
                  className="py-1 px-3 rounded-md bg-[#33363D] text-sm text-white font-medium"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-3">
            <p className="text-base font-bold text-white">About</p>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-400">
              <li>**Responds in**: {profileData.response_time}</li>
              <li>**Languages**: {profileData.languages.join(", ")}</li>
              <li>**Experience**: {profileData.experience}</li>
              <li className="list-none pt-2 text-gray-500 italic">
                {attorney.description}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Attorneys() {
  // Request Consult Modal এর জন্য স্টেট
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);

  // View Profile Modal এর জন্য স্টেট এবং কোন অ্যাটর্নি নির্বাচিত হয়েছে তার জন্য স্টেট
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  /** @type {[Attorney | null, function]} */
  const [selectedAttorney, setSelectedAttorney] = useState(null);

  // Consult Modal এর জন্য ফাংশন
  const openConsultModal = () => setIsConsultModalOpen(true);
  const closeConsultModal = () => setIsConsultModalOpen(false);

  // Profile Modal এর জন্য ফাংশন
  /**
   * @param {Attorney} attorney
   */
  const openProfileModal = (attorney) => {
    setSelectedAttorney(attorney);
    setIsProfileModalOpen(true);
  };
  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
    setSelectedAttorney(null);
  };

  return (
    <>
      <div className="max-w-[1440px] mx-auto w-11/12 pt-14 md:pt-24 lg:pt-28">
        <div className="flex justify-between">
          <header className="mb-6 space-y-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white leading-tight">
              Attorneys
            </h1>

            <p className="text-base text-gray">
              Filtered by: Family Law (Divorce, Custody)
            </p>
          </header>
          <div>
            <label className="relative">
              <Search className="absolute top-1/2 left-4 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Attorneys"
                className="py-4 pl-14 pr-6 border border-gray rounded-2xl"
              />
            </label>
          </div>
        </div>

        <br />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {attorneys.map((attorney, i) => (
            <div key={i} className="p-6 rounded-2xl bg-secondary space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <Image
                    src={attorney.image}
                    height={200}
                    width={200}
                    alt="User image"
                    className="w-16 h-16 p-2 border rounded-full"
                  />
                </div>
                <div className="text-left">
                  <h2 className="font-semibold leading-[26px] text-text_color">
                    {attorney.name}
                  </h2>
                  <p className="text-gray leading-normal">{attorney.title}</p>
                </div>
                <div>
                  <span className="p-2 bg-element text-gray">
                    {attorney.score.toFixed(2)}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-4 text-gray">
                  {attorney.practice_area.map((a, i) => (
                    <span key={i} className="py-1 px-2 rounded-lg bg-element">
                      {a}
                    </span>
                  ))}
                </div>
                <ul className="">
                  {attorney.practice_area.map((a, i) => (
                    <li key={i} className="text-gray">
                      {a}
                    </li>
                  ))}
                </ul>
                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={openConsultModal} // Request Consult বাটনের ক্লিক হ্যান্ডলার
                    className="py-3 w-full rounded-lg text-white text-sm font-medium transition duration-300 hover:opacity-90 bg-primary"
                  >
                    Request Consult
                  </button>
                  <button
                    onClick={() => openProfileModal(attorney)} // View Profile বাটনের ক্লিক হ্যান্ডলার
                    className="py-3 w-full rounded-lg text-white text-sm font-medium border border-gray transition duration-300 hover:bg-gray-700"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ৩. Conditionally Render the Modals */}

      {/* Request Consult Modal */}
      {isConsultModalOpen && (
        <RequestConsultModal closeModal={closeConsultModal} />
      )}

      {/* Attorney Profile Modal (ছবি অনুযায়ী) */}
      {isProfileModalOpen && selectedAttorney && (
        <AttorneyProfileModal
          attorney={selectedAttorney}
          closeModal={closeProfileModal}
        />
      )}
    </>
  );
}

export const RequestConsultModal = ({ closeModal }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Consultation request analyzed and ready to chat!");
      closeModal();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-opacity-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-secondary p-8 rounded-xl shadow-2xl max-w-5xl w-full relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            Request Consultation
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-white transition"
            aria-label="Close Modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="state"
              className="block text-sm font-semibold mb-2 text-gray-300"
            >
              State
            </label>
            <SelectWrapper>
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
              className={inputClasses}
              placeholder="e.g., 48226"
            />
          </div>

          <div>
            <label
              htmlFor="practiceArea"
              className="block text-sm font-semibold mb-2 text-gray-300"
            >
              Practice area
            </label>
            <SelectWrapper>
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
};
