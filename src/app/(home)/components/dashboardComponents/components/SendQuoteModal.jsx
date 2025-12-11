"use client";

import { useAuth } from "@/app/providers/Auth_Providers/AuthProviders";
import { MapPin, X } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";

export default function SendQuoteModal() {
  const { setShowModal, showModal } = useAuth();
  const handleQoutes = (v) => {
    try {
      if (v === "accept") {
        toast.success("Appointment successfully confirmed.");
      } else if (v === "reject") {
        toast.error("Reject the client offer!");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setShowModal(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 bg-opacity-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
      <div
        className={`bg-secondary p-6 sm:p-8 rounded-xl shadow-2xl max-w-xl w-full relative my-8`}
      >
        <div className="flex justify-between items-center absolute top-2 right-2">
          <button
            onClick={() => setShowModal(false)}
            className={`p-2 text-gray-400 hover:text-element transition rounded-full hover:bg-gray `}
            aria-label="Close Modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <p>{showModal ? "Show modal" : "close"}</p>
        <div className="flex flex-row items-center gap-4">
          <Image
            src={"/images/user.jpg"}
            height={200}
            width={200}
            alt="User image"
            className="w-20 rounded-full bg-cover bg-center border border-gray/20"
          />
          <div>
            <h2 className="text-xl md:text-2xl lg:text-3xl">Michael Smith</h2>
            <p className="text-gray">Doe Law PLLC · Detroit, MI</p>
          </div>
        </div>
        <div className="my-4 h-0 border-b w-full border-gray/20"></div>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="state"
              className="block text-sm font-semibold mb-2 text-gray"
            >
              Case Details
            </label>
            <textarea
              rows={3}
              placeholder="Enter case details....."
              className="bg-BG w-full p-4 outline-none rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-BG p-4 outline-none rounded-lg text-primary">
              <label
                htmlFor="location-input"
                className="block text-xs font-semibold mb-2 text-gray"
              >
                LOCATION
              </label>

              <div className="flex flex-row items-center gap-2">
                <MapPin className="text-primary" />
                <input
                  id="location-input"
                  type="text"
                  defaultValue="Texas, USA"
                  placeholder="Enter location"
                  className="text-white w-full bg-transparent border-none p-0 focus:outline-none focus:ring-0"
                />
              </div>
            </div>
            <div className="bg-BG p-4 outline-none rounded-lg text-primary">
              <label
                htmlFor="budget-input"
                className="block text-xs font-semibold mb-2 text-gray"
              >
                BUDGET
              </label>
              <div>
                <input
                  id="budget-input"
                  type="number"
                  defaultValue="$500"
                  placeholder="Enter budget"
                  className="text-white w-full bg-transparent border-none p-0 focus:outline-none focus:ring-0"
                />
              </div>
            </div>
          </div>

          <div className="bg-BG p-4 outline-none rounded-lg text-primary">
            <label
              htmlFor="message-input"
              className="block text-xs font-semibold mb-2 text-gray"
            >
              MESSAGE
            </label>
            <div>
              <textarea
                id="message-input"
                defaultValue="“I Can handle this page”"
                placeholder="Enter your message"
                rows={2}
                className="text-white w-full bg-transparent border-none p-0 focus:outline-none focus:ring-0 resize-none"
              />
            </div>
          </div>
          <div className="flex flex-row gap-4 items-center">
            <button
              onClick={() => handleQoutes("reject")}
              className={`w-full flex items-center justify-center p-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-8 bg-red-800/10 text-red-500 border border-red-800`}
            >
              Reject
            </button>
            <button
              onClick={() => handleQoutes("accept")}
              className={`w-full flex items-center justify-center p-4 rounded-lg text-white transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-8 bg-primary`}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
