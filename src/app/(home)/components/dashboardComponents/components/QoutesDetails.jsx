"use client";

import { useAuth } from "@/app/providers/Auth_Providers/AuthProviders";
import { MapPin, X, Loader2, CheckCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export default function QoutesDetails() {
  const { setShowModal, selectedRequest } = useAuth();
  const [loading, setLoading] = useState(false);

  // Local state to track if we just accepted it in this session
  const [isAccepted, setIsAccepted] = useState(
    selectedRequest?.status === "offered",
  );
  console.log(selectedRequest);
  const handleQoutes = async (v) => {
    if (v === "reject") {
      toast.error("You have rejected the offer.");
      setShowModal(false);
      return;
    }

    if (v === "accept") {
      setLoading(true);
      const tokenData = localStorage.getItem("token");
      const tokens = tokenData ? JSON.parse(tokenData) : null;

      try {
        const res = await axios.post(
          `http://10.10.7.19:8001/api/attorney/consultations/${selectedRequest.consultation}/accept/`,
          {},
          {
            headers: {
              Authorization: `Bearer ${tokens?.accessToken}`,
            },
          },
        );

        if (res.status === 200 || res.status === 201) {
          toast.success("Consultation accepted!");
          setIsAccepted(true); // Update UI immediately
          // Optional: You might want to refresh the background list here
          setTimeout(() => setShowModal(false), 1500);
        }
      } catch (error) {
        console.error("Accept Error:", error);
        toast.error(
          error.response?.data?.detail || "Already accepted or error occurred.",
        );
      } finally {
        setLoading(false);
      }
    }
  };

  if (!selectedRequest) return null;

  return (
    <div className="fixed inset-0 z-50 bg-opacity-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm">
      <div className="bg-secondary p-6 sm:p-8 rounded-xl shadow-2xl max-w-xl w-full relative my-8 border border-white/10 animate-in zoom-in duration-200">
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition rounded-full hover:bg-white/10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-row items-center gap-4 mb-6">
          <Image
            src={selectedRequest.sender.profile_image || "/images/user.jpg"}
            height={80}
            width={80}
            alt="User"
            className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
          />
          <div>
            <h2 className="text-xl font-bold">
              {selectedRequest.sender.full_name || "Client"}
            </h2>
            <p className="text-gray-400 text-sm">
              {selectedRequest.sender.email}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-BG p-4 rounded-lg border border-white/5">
            <label className="block text-[10px] font-bold mb-1 text-primary uppercase tracking-widest">
              Original Message
            </label>
            <p className="text-gray-300 text-sm italic">
              "{selectedRequest.message}"
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-BG p-4 rounded-lg border border-white/5">
              <label className="block text-[10px] font-bold mb-1 text-gray-500 uppercase">
                Location
              </label>
              <div className="flex items-center gap-2">
                <MapPin className="text-primary w-4 h-4" />
                <p className="text-white text-sm">{selectedRequest.location}</p>
              </div>
            </div>
            <div className="bg-BG p-4 rounded-lg border border-white/5">
              <label className="block text-[10px] font-bold mb-1 text-gray-500 uppercase">
                Budget
              </label>
              <p className="text-white font-bold text-sm">
                ${selectedRequest.budget}
              </p>
            </div>
          </div>

          {/* Logic for Buttons: If already accepted, show a status badge instead */}
          <div className="pt-4">
            {isAccepted ? (
              <div className="w-full flex items-center justify-center gap-2 p-4 rounded-xl bg-green-500/10 border border-green-500 text-green-500 font-bold">
                <CheckCircle size={20} />
                Accepted & Confirmed
              </div>
            ) : (
              <div className="flex flex-row gap-4 items-center">
                <button
                  onClick={() => handleQoutes("accept")}
                  disabled={loading}
                  className="w-full flex items-center justify-center p-4 rounded-xl text-white font-bold transition bg-primary hover:bg-opacity-90 disabled:opacity-50 shadow-lg shadow-primary/20"
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Accept"}
                </button>
                <button
                  onClick={() => handleQoutes("reject")}
                  disabled={loading}
                  className="w-full flex items-center justify-center p-4 rounded-xl font-bold transition bg-red-800/10 text-red-500 border border-red-800/50 hover:bg-red-800/20"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
