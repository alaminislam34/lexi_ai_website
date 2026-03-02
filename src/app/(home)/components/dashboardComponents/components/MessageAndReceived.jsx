"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { BiLoaderAlt } from "react-icons/bi";
import { useAuth } from "@/app/providers/Auth_Providers/AuthProviders";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardConversationList from "./DashboardConversationList";
import { MessageSquare } from "lucide-react";
import { X } from "lucide-react";
import { Check } from "lucide-react";
import { Eye } from "lucide-react";
import { MapPin } from "lucide-react";
import { MessageSquareMore } from "lucide-react";

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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentQuote, setPaymentQuote] = useState(null);

  // --- 1. Fetch Quotes ---
  const { data: quotes = [], isLoading } = useQuery({
    queryKey: ["receivedQuotes"],
    queryFn: async () => {
      const tokenData = localStorage.getItem("token");
      const tokens = tokenData ? JSON.parse(tokenData) : null;
      if (!tokens?.accessToken) throw new Error("No Access Token");

      const res = await axios.get(
        "http://3.142.150.64/api/attorney/consultations/reply-messages/",
        {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        },
      );
      return res.data;
    },
  });

  // --- 2. Accept Quote Mutation (Triggered after payment UI) ---
  const acceptMutation = useMutation({
    mutationFn: async (quoteId) => {
      const tokenData = localStorage.getItem("token");
      const tokens = tokenData ? JSON.parse(tokenData) : null;

      const res = await axios.post(
        `http://3.142.150.64/api/attorney/consultations/${quoteId}/accept/`,
        {},
        {
          headers: { Authorization: `Bearer ${tokens?.accessToken}` },
        },
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Payment processed and quote accepted!");
      setShowPaymentModal(false);
      setPaymentQuote(null);
      queryClient.invalidateQueries(["receivedQuotes"]);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to accept quote.");
    },
  });

  // --- 3. Reject Quote Mutation ---
  const rejectMutation = useMutation({
    mutationFn: async (quoteId) => {
      const tokenData = localStorage.getItem("token");
      const tokens = tokenData ? JSON.parse(tokenData) : null;

      const res = await axios.post(
        `http://3.142.150.64/api/attorney/consultations/${quoteId}/reject/`,
        {},
        {
          headers: { Authorization: `Bearer ${tokens?.accessToken}` },
        },
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Quote rejected successfully.");
      queryClient.invalidateQueries(["receivedQuotes"]);
    },
  });

  const handleOpenDetails = (quoteData) => {
    setSelectedRequest(quoteData);
    setShowModal(true);
  };

  const handleOpenPayment = (quote) => {
    setPaymentQuote(quote);
    setShowPaymentModal(true);
  };

  const handleClosePayment = () => {
    setShowPaymentModal(false);
    setPaymentQuote(null);
  };

  const handleReject = (e, quoteId) => {
    e.preventDefault();
    try {
      rejectMutation.mutate(quoteId);
    } catch (error) {
      console.log(error);
      toast.error("Failed to reject the quote. Please try again.");
    }
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    // Flow: UI Payment simulation -> Call backend Accept API
    if (paymentQuote) {
      acceptMutation.mutate(paymentQuote.id);
    }
  };
  const offeredQuotes = quotes?.filter((q) => q.status !== "rejected") || [];
  return (
    <div className="min-h-[600px] text-white">
      <div className="max-w-4xl mx-auto space-y-4">
        <DashboardConversationList title="Messages" limit={5} />

        {/* Received Quotes Section */}
        <div className="bg-secondary p-4 rounded-xl">
          <h2 className="text-xl font-semibold text-white mb-6">
            Received Quotes
          </h2>

          <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <BiLoaderAlt className="animate-spin text-primary text-3xl" />
              </div>
            ) : offeredQuotes.length > 0 ? (
              offeredQuotes.map((quote) => (
                <div
                  key={quote.id}
                  className="p-2 md:p-3 rounded-xl hover:shadow-md border duration-300 bg-[#212121] border-gray/20 flex items-center justify-between gap-3"
                >
                  {/* Left: Profile & Info */}
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <Image
                      src={quote.sender?.profile_image}
                      height={40}
                      width={40}
                      alt={quote.sender?.full_name}
                      className="w-9 h-9 rounded-full border border-white/30 p-1 object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-white flex flex-row items-center gap-2 font-medium md:text-lg truncate leading-none mb-1">
                        {quote.sender?.full_name}
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full border shrink-0 ${getStatusClasses(quote.status)}`}
                        >
                          {quote.status}
                        </span>
                      </p>
                      <p className="text-xs text-gray-400 truncate flex items-center gap-1">
                        <span>
                          <MapPin size={12} />
                        </span>{" "}
                        {quote.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-row items-center justify-between flex-1">
                    {/* Middle: Budget & Status */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm text-gray-400">Budget</p>
                        <p className="text-white font-bold text-sm leading-none">
                          ${quote.budget}
                        </p>
                      </div>
                    </div>

                    {/* Right: Actions (Icons Only) */}
                    <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                      <button
                        onClick={() => handleOpenDetails(quote)}
                        title="View Details"
                        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
                      >
                        <Eye size={18} />
                      </button>

                      {quote.status === "offered" && (
                        <>
                          <button
                            onClick={() => handleOpenPayment(quote)}
                            title="Accept Quote"
                            className="p-2 rounded-lg text-green-500 hover:bg-green-500/10 transition"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={(e) => handleReject(e, quote.id)}
                            disabled={rejectMutation.isLoading}
                            title="Reject Quote"
                            className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition disabled:opacity-50"
                          >
                            <X size={18} />
                          </button>
                        </>
                      )}

                      {quote.status === "accepted" && (
                        <Link
                          href={`/message?consultationId=${quote.consultation || quote.id}`}
                          title="Message Client"
                          className="p-2 rounded-lg text-blue-400 hover:bg-blue-400/10 transition"
                        >
                          <MessageSquareMore size={18} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-10">
                No quotes received yet.
              </p>
            )}
          </div>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && paymentQuote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-[#232323] border border-gray-700 rounded-xl p-8 w-full max-w-md shadow-2xl relative">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
                onClick={handleClosePayment}
              >
                &times;
              </button>
              <h3 className="text-2xl font-bold mb-4 text-white text-center">
                Secure Payment
              </h3>
              <div className="mb-6 text-center">
                <p className="text-gray-400 mb-1">
                  Accepting quote from{" "}
                  <span className="text-white font-medium">
                    {paymentQuote.sender?.full_name}
                  </span>
                </p>
                <p className="text-3xl font-bold text-primary">
                  ${paymentQuote.budget}
                </p>
              </div>

              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div className="space-y-3">
                  <input
                    type="text"
                    required
                    placeholder="Card Number"
                    className="w-full px-4 py-3 rounded-lg bg-[#181818] border border-gray-700 text-white focus:outline-none focus:border-primary transition"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      className=" px-4 py-3 rounded-lg bg-[#181818] border border-gray-700 text-white focus:outline-none focus:border-primary transition"
                    />
                    <input
                      type="text"
                      required
                      placeholder="CVC"
                      className=" px-4 py-3 rounded-lg bg-[#181818] border border-gray-700 text-white focus:outline-none focus:border-primary transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={acceptMutation.isLoading}
                  className="w-full py-3 rounded-lg bg-primary text-white font-bold hover:bg-dark-primary transition flex items-center justify-center gap-2"
                >
                  {acceptMutation.isLoading ? (
                    <>
                      <BiLoaderAlt className="animate-spin" /> Processing...
                    </>
                  ) : (
                    `Pay & Accept Quote`
                  )}
                </button>
                <p className="text-[10px] text-gray-500 text-center uppercase tracking-widest">
                  Secure encrypted transaction
                </p>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
