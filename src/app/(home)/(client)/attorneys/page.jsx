"use client";

import { Search, Loader2 } from "lucide-react";
import { useState, useMemo, useCallback, useEffect } from "react";
import axios from "axios";
import AttorneyCard from "./components/AttorneyCard";
import { AttorneyProfileModal, RequestConsultModal } from "./components/Modals";

export default function Attorneys() {
  const [attorneys, setAttorneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedAttorney, setSelectedAttorney] = useState(null);
  const [displayedCount, setDisplayedCount] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAttorneys = async () => {
      const tokenData = localStorage.getItem("token");
      if (!tokenData) {
        console.error("No token found in localStorage");
        setLoading(false);
        return;
      }

      const tokens = JSON.parse(tokenData);
      try {
        const res = await axios.get(
          "http://10.10.7.19:8001/api/attorney/attorneys/",
          {
            headers: {
              Authorization: `Bearer ${tokens.accessToken}`,
            },
          },
        );

        setAttorneys(res.data);
      } catch (error) {
        console.error("Error fetching attorneys:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttorneys();
  }, []);

  const openConsultModal = useCallback((attorney) => {
    setSelectedAttorney(attorney);
    setIsConsultModalOpen(true);
  }, []);

  const closeConsultModal = useCallback(() => {
    setIsConsultModalOpen(false);
    if (!isProfileModalOpen) setSelectedAttorney(null);
  }, [isProfileModalOpen]);

  const openProfileModal = useCallback((attorney) => {
    setSelectedAttorney(attorney);
    setIsProfileModalOpen(true);
  }, []);

  const closeProfileModal = useCallback(() => {
    setIsProfileModalOpen(false);
    setSelectedAttorney(null);
  }, []);

  const filteredAttorneys = useMemo(() => {
    if (!searchTerm) return attorneys;
    const lowerCaseSearch = searchTerm.toLowerCase();
    return attorneys.filter(
      (attorney) =>
        attorney.full_name?.toLowerCase().includes(lowerCaseSearch) ||
        attorney.preferred_legal_area?.toLowerCase().includes(lowerCaseSearch),
    );
  }, [searchTerm, attorneys]);

  const handleShowMore = useCallback(() => {
    if (displayedCount < filteredAttorneys.length) {
      setDisplayedCount((prev) => prev + 6);
    } else {
      setDisplayedCount(6);
    }
  }, [displayedCount, filteredAttorneys]);

  const attorneysToDisplay = filteredAttorneys.slice(0, displayedCount);
  const hasMore = displayedCount < filteredAttorneys.length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#12151B]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

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
                Found {filteredAttorneys.length} professionals
              </p>
            </header>
            <div className="relative w-full md:w-auto">
              <Search className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search Attorneys"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-2.5 pl-12 pr-6 border w-full md:w-[300px] border-gray-700 rounded-2xl bg-[#12151B] text-white focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {attorneysToDisplay.map((attorney) => (
              <AttorneyCard
                key={attorney.id}
                attorney={attorney}
                openConsultModal={() => openConsultModal(attorney)}
                openProfileModal={() => openProfileModal(attorney)}
              />
            ))}
          </div>

          <div className="text-center mt-10">
            {filteredAttorneys.length > 6 && (
              <button
                onClick={handleShowMore}
                className="px-8 py-3 rounded-lg text-white font-medium border border-gray-700 transition duration-300 hover:bg-gray-700"
              >
                {!hasMore ? "Show Less" : "Show More Attorneys"}
              </button>
            )}
          </div>
        </section>
      </div>

      {isConsultModalOpen && selectedAttorney && (
        <RequestConsultModal
          attorney={selectedAttorney}
          closeModal={closeConsultModal}
        />
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
