"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { BiMessageAltDetail, BiLoaderAlt } from "react-icons/bi";
import { useAuth } from "@/app/providers/Auth_Providers/AuthProviders";
import Link from "next/link";
import { RiStarFill, RiStarLine } from "react-icons/ri";
import { toast } from "react-toastify";

export default function ConsultRequest() {
  const { setShowModal, setSelectedRequest } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Dynamic Data from API
  useEffect(() => {
    const fetchConsultations = async () => {
      const tokenData = localStorage.getItem("token");
      const tokens = JSON.parse(tokenData);

      if (!tokens?.accessToken) {
        toast.error("Session expired. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          "http://10.10.7.19:8001/api/attorney/consultations/me/",
          {
            headers: {
              Authorization: `Bearer ${tokens.accessToken}`,
            },
          },
        );
        // Ensure we are setting the real data from the 'received' array
        setRequests(res.data.received || []);
      } catch (error) {
        console.error("Fetch Error:", error);
        toast.error("Failed to load real-time requests");
      } finally {
        setLoading(false);
      }
    };
    fetchConsultations();
  }, []);

  // 2. This function links the list to the Modal
  const handleOpenOfferModal = (item) => {
    // CRITICAL: We pass the REAL object to the global context
    setSelectedRequest(item);
    // Now the Modal has data and will render
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-secondary rounded-xl">
        <BiLoaderAlt className="animate-spin text-primary text-4xl" />
      </div>
    );
  }

  return (
    <div className="w-full text-white">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-secondary p-4 rounded-xl border border-gray-700/30 shadow-xl">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            Clients Requests
            <span className="bg-primary text-[10px] px-2 py-0.5 rounded-full">
              {requests.length}
            </span>
          </h2>

          <div className="flex flex-col gap-4">
            {requests.length > 0 ? (
              requests.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-[#212121] border border-gray/20 hover:border-primary/40 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3 w-full">
                      <div className="relative shrink-0">
                        <Image
                          src={item.sender.profile_image || "/images/user.jpg"}
                          height={50}
                          width={50}
                          alt="Sender"
                          className="w-12 h-12 rounded-full object-cover border border-gray-700 group-hover:border-primary/50 transition"
                        />
                        {item.status === "pending" && (
                          <span className="absolute top-0 right-0 w-3 h-3 bg-yellow-500 rounded-full border-2 border-[#212121]" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-medium text-base truncate">
                          {item.sender.full_name || "Guest User"}
                        </p>
                        <p className="text-xs text-gray-400 truncate font-semibold uppercase tracking-tighter">
                          {item.subject}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/20 p-3 rounded-lg mb-4 border border-white/5">
                    <p className="text-sm text-gray-300 line-clamp-2 italic">
                      "{item.message}"
                    </p>
                  </div>

                  <div className="grid grid-cols-2 items-center gap-4">
                    {/* Both buttons now trigger the Modal with the dynamic 'item' */}
                    <button
                      onClick={() => handleOpenOfferModal(item)}
                      className="w-full py-2 rounded-lg text-white text-xs font-medium border border-gray-600 hover:bg-white/5 transition"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleOpenOfferModal(item)}
                      className="w-full py-2 rounded-lg text-white text-xs font-semibold bg-primary hover:bg-opacity-90 transition shadow-lg shadow-primary/10"
                    >
                      Send Offer
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 border border-dashed border-gray-700 rounded-xl">
                <p className="text-gray-500 italic">No incoming requests</p>
              </div>
            )}
          </div>
        </div>

        {/* Score Section */}
        <div className="p-6 bg-secondary rounded-2xl flex flex-col gap-2 shadow-lg border border-gray-700/30">
          <h1 className="text-gray-400 text-sm font-medium uppercase tracking-widest">
            Attorney Score
          </h1>
          <div className="flex flex-row gap-4 items-center">
            <div className="flex text-primary">
              <RiStarFill className="text-2xl" />
              <RiStarFill className="text-2xl" />
              <RiStarFill className="text-2xl" />
              <RiStarFill className="text-2xl" />
              <RiStarLine className="text-2xl" />
            </div>
            <p className="text-3xl font-bold font-lora">4.0</p>
          </div>
        </div>

        {/* Message Navigation */}
        <div className="rounded-xl overflow-hidden bg-secondary p-4 shadow-lg border border-gray-700/30">
          <div className="flex items-center py-2 border-b border-gray-700/50 mb-4">
            <BiMessageAltDetail className="w-5 h-5 mr-3 text-primary" />
            <h2 className="text-lg font-semibold">Quick Actions</h2>
          </div>
          <Link
            href="/message"
            className="w-full py-3 inline-block text-center rounded-xl text-white text-sm font-semibold transition duration-300 bg-primary/10 border border-primary/30 hover:bg-primary/20"
          >
            Open Inbox
          </Link>
        </div>
      </div>
    </div>
  );
}
