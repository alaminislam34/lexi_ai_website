"use client";

import { Search, Loader2 } from "lucide-react";
import { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AttorneyCard from "./components/AttorneyCard";
import { AttorneyProfileModal, RequestConsultModal } from "./components/Modals";
import { getTierDescription } from "../../../../lib/mockAttorneys";
import baseApi from "../../../../api/base_url";

export default function Attorneys() {
  const searchParams = useSearchParams();
  const [attorneys, setAttorneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedAttorney, setSelectedAttorney] = useState(null);
  const [displayedCount, setDisplayedCount] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [caseTier, setCaseTier] = useState(null);

  const tierValue = useMemo(() => {
    const rawTier = searchParams.get("tier");
    const parsed = Number(rawTier);
    return [1, 2, 3].includes(parsed) ? parsed : null;
  }, [searchParams]);

  const tierNumberToLabel = useCallback((tier) => {
    const map = { 1: "one", 2: "two", 3: "three" };
    return map[Number(tier)] || null;
  }, []);

  const normalizeAttorneyTier = useCallback(
    (attorney) => {
      const rawTier = attorney?.attorney?.tier ?? attorney?.tier ?? null;
      if (!rawTier) return null;

      const tierAsString = `${rawTier}`.toLowerCase().trim();
      if (["one", "two", "three"].includes(tierAsString)) {
        return tierAsString;
      }
      return tierNumberToLabel(tierAsString);
    },
    [tierNumberToLabel],
  );

  useEffect(() => {
    const fetchAttorneys = async () => {
      setLoading(true);
      const targetTier = tierValue ? tierNumberToLabel(tierValue) : null;
      setCaseTier(tierValue);

      const tokenData = localStorage.getItem("token");
      let accessToken = null;

      if (tokenData) {
        try {
          const tokens = JSON.parse(tokenData);
          accessToken = tokens?.accessToken || null;
        } catch (parseError) {
          console.error("Token parse error:", parseError);
        }
      }

      try {
        const res = await baseApi.get("/api/attorney/attorneys/", {
          headers: accessToken
            ? { Authorization: `Bearer ${accessToken}` }
            : undefined,
        });

        let attorneyList = res.data || [];

        if (
          !Array.isArray(attorneyList) &&
          Array.isArray(attorneyList?.results)
        ) {
          attorneyList = attorneyList.results;
        }

        if (targetTier) {
          const matched = attorneyList.filter(
            (atty) => normalizeAttorneyTier(atty) === targetTier,
          );
          setAttorneys(matched);
        } else {
          setAttorneys(attorneyList);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        setAttorneys([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAttorneys();
  }, [tierValue, tierNumberToLabel, normalizeAttorneyTier]);

  const filteredAttorneys = useMemo(() => {
    const lowerCaseSearch = searchTerm.toLowerCase().trim();
    if (!lowerCaseSearch) return attorneys;

    return attorneys.filter(
      (atty) =>
        atty.full_name?.toLowerCase().includes(lowerCaseSearch) ||
        atty.location?.toLowerCase().includes(lowerCaseSearch) ||
        atty.preferred_legal_area?.toLowerCase().includes(lowerCaseSearch),
    );
  }, [searchTerm, attorneys]);

  const attorneysToDisplay = useMemo(
    () => filteredAttorneys.slice(0, displayedCount),
    [filteredAttorneys, displayedCount],
  );

  const hasMore = displayedCount < filteredAttorneys.length;

  const openConsultModal = useCallback((attorney) => {
    setSelectedAttorney(attorney);
    setIsConsultModalOpen(true);
  }, []);

  const closeConsultModal = useCallback(() => {
    setIsConsultModalOpen(false);
    if (!isProfileModalOpen) setSelectedAttorney(null);
  }, [isProfileModalOpen]);

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
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <header className="space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl md:text-2xl lg:text-4xl font-semibold text-white">
                  Recommended Attorneys
                </h1>
                {caseTier && (
                  <span className="px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-bold rounded-full">
                    Tier {caseTier} Match
                  </span>
                )}
                {caseTier && (
                  <Link
                    href="/attorneys"
                    className="px-3 py-1 bg-gray-700/60 text-gray-200 border border-gray-600 text-xs font-semibold rounded-full hover:bg-gray-600/70 transition-colors"
                  >
                    Show All Attorneys
                  </Link>
                )}
              </div>
              {caseTier && (
                <p className="text-sm text-blue-400/80 font-medium">
                  {getTierDescription(caseTier)}
                </p>
              )}
              <p className="text-sm text-gray-400">
                Found {filteredAttorneys.length} specialists matched to your
                case
              </p>
            </header>

            <div className="relative">
              <Search className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, location or area..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-2.5 pl-12 pr-6 border w-full md:w-[350px] border-gray-700 rounded-2xl bg-[#12151B] text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>
          </div>

          {filteredAttorneys.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-gray-900/20 rounded-3xl border border-dashed border-gray-800">
              <Search className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-lg font-medium">No attorneys found</p>
              <p className="text-sm text-center px-4">
                We couldn&apos;t find any actual data matching your case&apos;s
                requirements.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {attorneysToDisplay.map((attorney) => (
                <AttorneyCard
                  key={attorney.id || attorney.full_name}
                  attorney={attorney}
                  openConsultModal={() => openConsultModal(attorney)}
                  openProfileModal={() => {
                    setSelectedAttorney(attorney);
                    setIsProfileModalOpen(true);
                  }}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            {filteredAttorneys.length > 6 && (
              <button
                onClick={() =>
                  setDisplayedCount((prev) => (hasMore ? prev + 6 : 6))
                }
                className="px-10 py-3 rounded-xl text-white font-medium border border-gray-700 hover:bg-white hover:text-black transition-all duration-300"
              >
                {hasMore ? "Show More Attorneys" : "Show Less"}
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
          closeModal={() => setIsProfileModalOpen(false)}
          openConsultModal={openConsultModal}
        />
      )}
    </>
  );
}
