// src/components/AttorneyList/Attorneys.jsx
"use client";

import { Search, ChevronDown, Loader2, X } from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import AttorneyCard from "./components/AttorneyCard";
import { AttorneyProfileModal, RequestConsultModal } from "./components/Modals";

const generateAttorneys = (count) => {
  const baseAttorneys = [
    {
      image: "/images/user.jpg",
      name: "Jane Doe, Esq.",
      score: 3.7,
      title: "Criminal Defense Expert",
      practice_area: ["Criminal Defense", "DUI/OWI", "Expungement"],
      description: [
        "Responds in ~2 hrs",
        "Languages: English, Spanish",
        "Experience: 8+ years",
        "Answer a few guided questions. No sensitive info required.",
      ],
    },
    {
      image: "/images/user.jpg",
      name: "John Smith, Esq.",
      score: 4.7,
      title: "Civil Litigation Specialist",
      practice_area: ["Family Law", "Real Estate", "Civil Litigation"],
      description: [
        "Responds in ~2 hrs",
        "Languages: English, Spanish",
        "Experience: 8+ years",
        "We cite official sources and explain options clearly.",
      ],
    },
    {
      image: "/images/user.jpg",
      name: "Alice Johnson, Esq.",
      score: 5.0,
      title: "Real Estate & Property Law",
      practice_area: ["Estate Planning", "Real Estate", "Business Law"],
      description: [
        "Responds in ~2 hrs",
        "Languages: English, Spanish",
        "Experience: 8+ years",
        "Match with verified lawyers by practice area and ZIP.",
      ],
    },
  ];

  return Array.from({ length: count }, (_, i) => {
    const base = baseAttorneys[i % baseAttorneys.length];
    return {
      ...base,
      name: `${base.name.split(",")[0].replace(/\d+/g, "")} ${i + 1}, Esq.`,
      score: (base.score + i * 0.1) % 5.0,
    };
  });
};

const ALL_ATTORNEYS = generateAttorneys(30);
const INITIAL_LOAD_COUNT = 6;
const LOAD_MORE_COUNT = 6;

// --- Main Component ---

export default function Attorneys() {
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedAttorney, setSelectedAttorney] = useState(null);
  const [displayedCount, setDisplayedCount] = useState(INITIAL_LOAD_COUNT);
  const [searchTerm, setSearchTerm] = useState("");

  const openConsultModal = useCallback(() => setIsConsultModalOpen(true), []);
  const closeConsultModal = useCallback(() => setIsConsultModalOpen(false), []);

  const openProfileModal = useCallback((attorney) => {
    setSelectedAttorney(attorney);
    setIsProfileModalOpen(true);
  }, []);
  const closeProfileModal = useCallback(() => {
    setIsProfileModalOpen(false);
    setSelectedAttorney(null);
  }, []);

  const filteredAttorneys = useMemo(() => {
    if (!searchTerm) return ALL_ATTORNEYS;
    const lowerCaseSearch = searchTerm.toLowerCase();
    return ALL_ATTORNEYS.filter(
      (attorney) =>
        attorney.name.toLowerCase().includes(lowerCaseSearch) ||
        attorney.practice_area.some((area) =>
          area.toLowerCase().includes(lowerCaseSearch)
        )
    );
  }, [searchTerm]); // FIX 1: Added filteredAttorneys to the dependency array.

  const handleShowMore = useCallback(() => {
    // If there are more attorneys to show, load more. Otherwise, reset to initial count (Show Less).
    if (displayedCount < filteredAttorneys.length) {
      setDisplayedCount((prevCount) => prevCount + LOAD_MORE_COUNT);
    } else {
      setDisplayedCount(INITIAL_LOAD_COUNT);
    }
  }, [displayedCount, filteredAttorneys]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setDisplayedCount(INITIAL_LOAD_COUNT);
  };

  const attorneysToDisplay = filteredAttorneys.slice(0, displayedCount);
  const hasMore = displayedCount < filteredAttorneys.length;

  return (
    <>
           
      <div className="max-w-[1440px] mx-auto w-11/12 min-h-screen flex flex-col pt-28 pb-12">
        <section className="w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <header className="mb-6 md:mb-0 space-y-1">
              <h1 className="text-xl md:text-2xl lg:text-4xl font-semibold text-white leading-tight">
                  Attorneys              
              </h1>
              <p className="text-sm md:text-base text-gray-400">
                  Filtered by: Family Law (Divorce, Custody)      
              </p>
            </header>
            <div className="relative w-full md:w-auto">
              <Search className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search Attorneys"
                value={searchTerm}
                onChange={handleSearchChange}
                className="py-2.5 pl-12 pr-6 border w-full md:w-[300px] border-gray-700 rounded-2xl bg-[#12151B] text-white focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {attorneysToDisplay.map((attorney, i) => (
              <AttorneyCard
                key={i}
                attorney={attorney}
                openConsultModal={openConsultModal}
                openProfileModal={openProfileModal}
              />
            ))}
          </div>
          <div className="text-center mt-10">
            {filteredAttorneys.length > 0 && (
              <button
                onClick={handleShowMore}
                className="px-8 py-3 rounded-lg text-white font-medium border border-gray-700 transition duration-300 hover:bg-gray-700"
              >
                  {!hasMore ? "Show Less" : "Show More Attorneys"}     
              </button>
            )}
          </div>
          {filteredAttorneys.length === 0 && searchTerm && (
            <p className="text-center text-gray-400 text-lg mt-10">
              No attorneys found matching &quot;{searchTerm}
              &quot;.            
            </p>
          )}
        </section>
             
      </div>
           
      {isConsultModalOpen && (
        <RequestConsultModal closeModal={closeConsultModal} />
      )}
           
      {isProfileModalOpen && selectedAttorney && (
        <AttorneyProfileModal
          attorney={selectedAttorney}
          closeModal={closeProfileModal}
          openConsultModal={openConsultModal}
        />
      )}
         
    </>
  );
}
