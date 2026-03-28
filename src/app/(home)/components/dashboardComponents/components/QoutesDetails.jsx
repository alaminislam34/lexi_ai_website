"use client";

import { useAuth } from "@/providers/Auth_Providers/AuthProviders";
import { MapPin, X, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function QoutesDetails() {
  const { setShowModal, selectedRequest } = useAuth();
  const isAccepted = selectedRequest ? status === "accepted" : false;

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
            src={selectedRequest.sender.profile_image}
            height={80}
            width={80}
            alt="User"
            className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
          />
          <div>
            <h2 className="text-xl font-bold">
              {selectedRequest.sender.full_name}
              <span
                className={`text-xs ml-4 rounded-full px-3 py-1 bg-gray-600 ${selectedRequest?.status === "offered" ? "text-yellow-400 " : selectedRequest?.status === "accepted" ? "text-green-400" : "text-red-400"}`}
              >
                {selectedRequest?.status}
              </span>
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
              &ldquo;{selectedRequest.last_message}&rdquo;
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

          <div className="pt-4">
            {isAccepted && (
              <div className="space-y-3">
                <div className="w-full flex items-center justify-center gap-2 p-4 rounded-xl bg-green-500/10 border border-green-500 text-green-500 font-bold">
                  <CheckCircle size={20} />
                  Accepted & Confirmed
                </div>
                <Link
                  href={`/message?consultationId=${selectedRequest.consultation}`}
                  className="w-full inline-flex items-center justify-center p-4 rounded-xl text-white font-bold transition bg-primary hover:bg-opacity-90 shadow-lg shadow-primary/20"
                >
                  Message Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
