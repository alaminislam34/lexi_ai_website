"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { BiMessageAltDetail, BiLoaderAlt } from "react-icons/bi";
import { useAuth } from "@/app/providers/Auth_Providers/AuthProviders";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import DashboardConversationList from "./DashboardConversationList";

const TEXT_ELEMENT_BG = "bg-[#33363D]";

const getStatusClasses = (status) => {
  if (status === "accepted") {
    return "bg-green-500/10 text-green-400 border-green-500/40";
  }
  if (status === "offered") {
    return "bg-yellow-500/10 text-yellow-300 border-yellow-500/30";
  }
  if (status === "rejected") {
    return "bg-red-500/10 text-red-400 border-red-500/30";
  }
  return "bg-gray-500/10 text-gray-300 border-gray-500/30";
};

export default function MessageAndReceived() {
  const { setShowModal, setSelectedRequest } = useAuth();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch REAL Quotes from your API
  useEffect(() => {
    const fetchQuotes = async () => {
      const tokenData = localStorage.getItem("token");
      const tokens = tokenData ? JSON.parse(tokenData) : null;

      try {
        const res = await axios.get(
          "http://10.10.7.19:8001/api/attorney/consultations/reply-messages/",
          {
            headers: {
              Authorization: `Bearer ${tokens?.accessToken}`,
            },
          },
        );
        console.log(res.data)
        setQuotes(res.data || []);
      } catch (error) {
        console.error("Fetch Error:", error);
        toast.error("Failed to load received quotes.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, []);
  console.log(quotes, "user qoutes");

  const handleOpenDetails = (quoteData) => {
    setSelectedRequest(quoteData); // Set the real data for the QoutesDetails modal
    setShowModal(true);
  };

  return (
    <div className={`min-h-screen text-white`}>
      <div className="max-w-4xl mx-auto space-y-6">
        <DashboardConversationList title="Messages" limit={5} />

        {/* Received Quotes Section - Now Dynamic */}
        <div className="bg-secondary p-4 rounded-xl">
          <h2 className="text-xl font-semibold text-white mb-6">
            Received Quotes
          </h2>

          <div className="flex flex-col gap-2">
            {loading ? (
              <div className="flex justify-center py-10">
                <BiLoaderAlt className="animate-spin text-primary text-3xl" />
              </div>
            ) : quotes.length > 0 ? (
              quotes.map((quote) => (
                <div
                  key={quote.id}
                  className={`p-3 rounded-xl hover:shadow-[2px_2px_6px_0px_rgb(255,255,255,0.1)] duration-300 bg-[#212121] border border-gray/20`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Image
                        src={quote.sender.profile_image || "/images/user.jpg"}
                        height={50}
                        width={50}
                        alt={quote.sender.full_name}
                        className="w-10 md:w-12 h-10 md:h-12 rounded-full object-cover"
                      />
                      <div className="min-w-0">
                        <p className="text-white font-medium text-sm md:text-lg truncate">
                          {quote.sender.full_name || "New Client"}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs sm:text-sm text-gray-400 truncate">
                            {quote.location || "Location not provided"}
                          </p>
                          <span
                            className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full border ${getStatusClasses(quote.status)}`}
                          >
                            {quote.status || "unknown"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`px-4 py-2 rounded-lg text-gray text-xs sm:text-sm border border-gray-700/50`}
                    >
                      Budget
                      <span className="block text-center mt-0.5 text-white font-bold">
                        ${quote.budget}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenDetails(quote)}
                    className={`w-full py-2 rounded-lg text-white transition duration-300 bg-primary hover:bg-dark-primary`}
                  >
                    View Details
                  </button>
                  {quote.status === "accepted" && (
                    <Link
                      href={`/message?consultationId=${quote.consultation || quote.id}`}
                      className="w-full mt-2 inline-block text-center py-2 rounded-lg text-white transition duration-300 bg-primary/20 border border-primary/40 hover:bg-primary/30"
                    >
                      Message Client
                    </Link>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-10">
                No quotes received yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
