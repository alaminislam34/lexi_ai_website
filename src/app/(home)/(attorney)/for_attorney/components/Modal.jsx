"use client";
import { CreditCard } from "lucide-react";
import { ChevronDown, Loader2, X } from "lucide-react";
import { useState } from "react";

const inputClasses = `w-full py-2 px-4 border-none rounded-lg placeholder:text-gray text-black focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-500 appearance-none shadow-inner bg-white`;

export const UpdatePaymentModal = ({ setShowModal }) => {
  const [cardName, setCardName] = useState("Olivia Rhye");
  const [expiry, setExpiry] = useState("06 / 2024");
  const [cardNumber, setCardNumber] = useState("1234 1234 1234 1234");
  const [cvv, setCvv] = useState("•••");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log("Payment details updated.");
      setShowModal(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
      <div
        className={`bg-secondary p-6 rounded-2xl shadow-2xl max-w-md w-full relative my-8`}
      >
        <div className="flex flex-col items-start space-y-4 mb-6">
          <div className="p-2 rounded-full bg-white text-primary">
            <CreditCard />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              Update payment method
            </h2>
            <p className="text-sm text-gray">Update your card details.</p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label
                htmlFor="cardName"
                className="block text-xs font-medium text-gray mb-2"
              >
                Name on card
              </label>
              <input
                type="text"
                id="cardName"
                className={inputClasses}
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                required
              />
            </div>
            {/* Expiry */}
            <div>
              <label
                htmlFor="expiry"
                className="block text-xs font-medium text-gray mb-2"
              >
                Expiry
              </label>
              <input
                type="text"
                id="expiry"
                className={inputClasses}
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label
                htmlFor="cardNumber"
                className="block text-xs font-medium text-gray mb-2"
              >
                Card number
              </label>
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 38 24"
                  fill="none"
                  width="24"
                  height="24"
                >
                  <circle cx="12" cy="12" r="12" fill="#FF5F00" />
                  <circle cx="26" cy="12" r="12" fill="#EB001B" />
                  <path
                    d="M14 12a6 6 0 1 0 12 0 6 6 0 0 0-12 0z"
                    fill="#F79F1A"
                  />
                </svg>
                <input
                  type="text"
                  id="cardNumber"
                  className={`${inputClasses} pl-10`}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="cvv"
                className="block text-xs font-medium text-gray mb-2"
              >
                CVV
              </label>
              <input
                type="password"
                id="cvv"
                className={inputClasses}
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex justify-between space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className={`w-full py-2 px-4 rounded-lg text-white transition duration-300 border border-gray/20 hover:bg-gray/20`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center py-2 px-4 rounded-lg text-white transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-primary hover:bg-dark-primary`}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Update"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
