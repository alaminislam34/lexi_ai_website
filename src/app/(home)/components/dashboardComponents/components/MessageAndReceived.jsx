"use client";

import React from "react";
import Image from "next/image";
import { BiLoaderAlt } from "react-icons/bi";
import { useAuth } from "@/app/providers/Auth_Providers/AuthProviders";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardConversationList from "./DashboardConversationList";

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
  const queryClient = useQueryClient();

  // --- 1. Fetch Quotes using useQuery ---
  const { data: quotes = [], isLoading } = useQuery({
    queryKey: ["receivedQuotes"],
    queryFn: async () => {
      const tokenData = localStorage.getItem("token");
      const tokens = tokenData ? JSON.parse(tokenData) : null;
      if (!tokens?.accessToken) throw new Error("No Access Token");

      const res = await axios.get(
        "http://10.10.7.19:8002/api/attorney/consultations/reply-messages/",
        {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        },
      );
      return res.data;
    },
    onError: (err) => {
      console.error("Fetch Error:", err);
      toast.error("Failed to load received quotes.");
    },
  });

  // --- 2. Reject Quote Mutation ---
  const rejectMutation = useMutation({
    mutationFn: async (quoteId) => {
      const tokenData = localStorage.getItem("token");
      const tokens = tokenData ? JSON.parse(tokenData) : null;

      // API call to reject
      const res = await axios.post(
        `http://10.10.7.19:8002/api/attorney/consultations/${quoteId}/reject/`,
        {}, // body usually empty for this action
        {
          headers: { Authorization: `Bearer ${tokens?.accessToken}` },
        },
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Quote rejected successfully.");
      // Invalidate and refetch the list to show updated status
      queryClient.invalidateQueries(["receivedQuotes"]);
    },
    onError: (error) => {
      console.error("Reject Error:", error);
      toast.error(error?.response?.data?.message || "Failed to reject quote.");
    },
  });

  const handleOpenDetails = (quoteData) => {
    setSelectedRequest(quoteData);
    setShowModal(true);
  };

  const handleReject = (e, quoteId) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to reject this quote?")) {
      rejectMutation.mutate(quoteId);
    }
  };

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-4xl mx-auto space-y-6">
        <DashboardConversationList title="Messages" limit={5} />

        {/* Received Quotes Section */}
        <div className="bg-secondary p-4 rounded-xl">
          <h2 className="text-xl font-semibold text-white mb-6">
            Received Quotes
          </h2>

          <div className="flex flex-col gap-2">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <BiLoaderAlt className="animate-spin text-primary text-3xl" />
              </div>
            ) : quotes.length > 0 ? (
              quotes.map((quote) => (
                <div
                  key={quote.id}
                  className="p-3 rounded-xl hover:shadow-[2px_2px_6px_0px_rgb(255,255,255,0.1)] duration-300 bg-[#212121] border border-gray/20"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Image
                        src={quote.sender?.profile_image || "/images/user.jpg"}
                        height={50}
                        width={50}
                        alt={quote.sender?.full_name || "User"}
                        className="w-10 md:w-12 h-10 md:h-12 rounded-full object-cover"
                      />
                      <div className="min-w-0">
                        <p className="text-white font-medium text-sm md:text-lg truncate">
                          {quote.sender?.full_name || "New Client"}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs sm:text-sm text-gray-400 truncate">
                            {quote.location || "Location not provided"}
                          </p>
                          <span
                            className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full border ${getStatusClasses(
                              quote.status,
                            )}`}
                          >
                            {quote.status || "unknown"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="px-4 py-2 rounded-lg text-gray text-xs sm:text-sm border border-gray-700/50">
                      Budget
                      <span className="block text-center mt-0.5 text-white font-bold">
                        ${quote.budget}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => handleOpenDetails(quote)}
                      className="flex-1 py-2 rounded-lg text-white transition duration-300 bg-primary hover:bg-dark-primary text-sm"
                    >
                      View Details
                    </button>

                    {/* Reject Button: Only show if not already rejected/accepted */}
                    {quote.status === "offered" && (
                      <button
                        onClick={(e) => handleReject(e, quote.id)}
                        disabled={rejectMutation.isLoading}
                        className="flex-1 py-2 rounded-lg text-white transition duration-300 bg-red-500/20 border border-red-500/40 hover:bg-red-500/40 text-sm disabled:opacity-50"
                      >
                        {rejectMutation.isLoading &&
                        rejectMutation.variables === quote.id
                          ? "Rejecting..."
                          : "Reject Quote"}
                      </button>
                    )}
                  </div>

                  {quote.status === "accepted" && (
                    <Link
                      href={`/message?consultationId=${
                        quote.consultation || quote.id
                      }`}
                      className="w-full mt-2 inline-block text-center py-2 rounded-lg text-white transition duration-300 bg-green-500/20 border border-green-500/40 hover:bg-green-500/30 text-sm"
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
