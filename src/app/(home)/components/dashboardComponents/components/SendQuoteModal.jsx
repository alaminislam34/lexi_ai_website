"use client";

import { useAuth } from "@/app/providers/Auth_Providers/AuthProviders";
import { MapPin, X, Loader2, DollarSign } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { StateContext } from "@/app/providers/StateProvider";

export default function SendQuoteModal() {
  const { setShowModal, selectedRequest } = useAuth();
  const { user } = useContext(StateContext);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    subject: "",
    case_details: "",
    location: "",
    budget: "",
    message: "",
  });

  useEffect(() => {
    if (selectedRequest) {
      setFormData({
        subject: `Re: ${selectedRequest.subject}`,
        case_details: selectedRequest.message || "",
        location: selectedRequest.location || "",
        budget: selectedRequest.budget || "",
        message: `Hello ${selectedRequest.sender.full_name || "Client"}, I am interested in your case regarding ${selectedRequest.subject}.`,
      });
    }
  }, [selectedRequest]);

  const handleSendOffer = async () => {
    // Basic Validation
    if (!formData.budget || !formData.message || !formData.location) {
      toast.error("Please fill in the budget, location, and message.");
      return;
    }

    setLoading(true);
    const tokenData = localStorage.getItem("token");
    const tokens = tokenData ? JSON.parse(tokenData) : null;

    try {
      const res = await axios.post(
        `http://10.10.7.19:8002/api/attorney/consultations/${selectedRequest.id}/reply/`,
        {
          subject: formData.subject,
          case_details: formData.case_details,
          location: formData.location,
          budget: formData.budget,
          message: formData.message,
        },
        {
          headers: {
            Authorization: `Bearer ${tokens?.accessToken}`,
          },
        },
      );

      if (res.status === 200 || res.status === 201) {
        toast.success("Professional offer sent successfully.");
        setShowModal(false);
      }
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error(
        error.response?.data?.detail || "Failed to process the offer.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!selectedRequest) return null;

  return (
    <div className="fixed inset-0 z-100 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-secondary max-h-[80vh] border border-white/10 p-6 md:p-8 rounded-2xl shadow-2xl max-w-2xl w-full relative animate-in fade-in zoom-in duration-200">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Image
                src={selectedRequest.sender.profile_image || "/images/user.jpg"}
                height={64}
                width={64}
                alt="Client"
                className="w-16 h-16 rounded-full object-cover border-2 border-primary"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-secondary rounded-full"></span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {selectedRequest.sender.full_name || "New Client"}
              </h2>
              <p className="text-gray-400 text-sm">
                {selectedRequest.sender.email}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(false)}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Dynamic Context Box */}
        <div className="mb-6 p-4 bg-black/30 rounded-xl border border-white/5">
          <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">
            Client&apos;s Request (
            {new Date(selectedRequest.created_at).toLocaleDateString()})
          </h4>
          <p className="text-white font-semibold mb-1">
            {selectedRequest.subject}
          </p>
          <p className="text-gray-400 text-sm italic leading-relaxed overflow-y-auto max-h-40">
            &ldquo;{selectedRequest.message}&rdquo;
          </p>
        </div>

        {/* Interactive Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Location Input */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-400 ml-1">
                Proposed Location
              </label>
              <div className="flex items-center gap-3 bg-BG p-3 rounded-xl border border-white/5 focus-within:border-primary/50 transition">
                <MapPin className="text-primary w-5 h-5" />
                <input
                  type="text"
                  placeholder="e.g. Virtual or Office Address"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="bg-transparent border-none text-white w-full focus:ring-0 text-sm"
                />
              </div>
            </div>

            {/* Budget Input */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-400 ml-1">
                Budget / Fee ($)
              </label>
              <div className="flex items-center gap-3 bg-BG p-3 rounded-xl border border-white/5 focus-within:border-primary/50 transition">
                <DollarSign className="text-primary w-5 h-5" />
                <input
                  type="number"
                  placeholder="0.00"
                  value={formData.budget}
                  onChange={(e) =>
                    setFormData({ ...formData, budget: e.target.value })
                  }
                  className="bg-transparent border-none text-white w-full focus:ring-0 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Reply Message */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-400 ml-1">
              Your Message to Client
            </label>
            <textarea
              rows={4}
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="bg-BG w-full p-4 rounded-xl border border-white/5 text-white text-sm focus:ring-1 focus:ring-primary/50 focus:border-primary/50 outline-none transition resize-none"
              placeholder="Explain how you can help..."
            />
          </div>

          {/* Action Footer */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowModal(false)}
              className="flex-1 py-3 text-sm font-bold text-gray-400 hover:text-white border border-white/10 rounded-xl hover:bg-white/5 transition"
            >
              Discard
            </button>
            <button
              onClick={handleSendOffer}
              disabled={loading}
              className="flex-2 py-3 text-sm font-bold text-white bg-primary rounded-xl hover:bg-opacity-90 transition flex justify-center items-center gap-2 disabled:opacity-50 shadow-lg shadow-primary/20"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                "Send Professional Quote"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
