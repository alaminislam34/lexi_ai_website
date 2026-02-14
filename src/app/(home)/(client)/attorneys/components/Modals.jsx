import { Loader2, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

// Configuration Constants
const PRIMARY_COLOR_CLASSES = "bg-blue-500 hover:bg-blue-600";
const SECONDARY_BG_COLOR = "bg-[#1D1F23]";
const TEXT_ELEMENT_BG = "bg-[#33363D]";
const inputClasses = `w-full py-3 px-6 border-none rounded-lg text-white text-base focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-500 appearance-none shadow-inner bg-[#12151B]`;

/**
 * Attorney Profile Modal
 * Displays full details of the attorney and provides a bridge to the consult modal.
 */
export const AttorneyProfileModal = ({
  attorney,
  closeModal,
  openConsultModal,
}) => {
  if (!attorney) return null;

  const profileData = {
    name: attorney.name,
    location: attorney.location,
    score: attorney.rating?.average || 0.0,
    practice_areas: attorney.preferred_legal_area
      ? [attorney.preferred_legal_area]
      : ["General Law"],
    image: attorney.profile_image,
    summary: `Professional attorney specialized in ${
      attorney.preferred_legal_area
    }. Dedicated to providing strategic litigation and client success.`,
    details: [
      { label: "Gender", value: attorney.gender },
      { label: "Role", value: attorney.role },
      {
        label: "Joined",
        value: attorney.date_joined
          ? new Date(attorney.date_joined).toLocaleDateString()
          : "N/A",
      },
    ],
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div
        className={`${SECONDARY_BG_COLOR} rounded-2xl shadow-2xl max-w-xl w-full relative my-8`}
      >
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-white transition rounded-full hover:bg-[#33363D]"
        >
          <X size={20} />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header Section */}
          <div className="flex flex-col gap-4 border-b border-gray-700/50 pb-4">
            <div className="flex flex-row items-start justify-between gap-4">
              <div className="flex items-start space-x-4">
                <div className="relative h-16 w-16 shrink-0">
                  <Image
                    src={profileData.image}
                    fill
                    alt={profileData?.name || "Attorney Profile Image"}
                    className="rounded-full object-cover p-1 border border-gray-700/50"
                  />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl font-bold text-white truncate">
                    {profileData.name}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {profileData.location}
                  </p>
                </div>
              </div>
              <span
                className={`text-xs text-gray-400 flex items-center gap-1 shrink-0 ${TEXT_ELEMENT_BG} py-1 px-2 rounded-lg`}
              >
                <FaStar className="text-orange-400 w-3 h-3" />
                {Number(profileData.score).toFixed(1)}
              </span>
            </div>
            <button
              onClick={() => {
                openConsultModal(attorney);
                closeModal();
              }}
              className={`px-6 py-2.5 rounded-lg text-white font-bold transition duration-300 w-full ${PRIMARY_COLOR_CLASSES}`}
            >
              Request Consult
            </button>
          </div>

          {/* Practice Areas */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
              Practice Areas
            </p>
            <div className="flex flex-wrap gap-2">
              {profileData.practice_areas.map((area, i) => (
                <span
                  key={i}
                  className={`py-1 px-3 rounded-full ${TEXT_ELEMENT_BG} text-sm text-white font-medium`}
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* Grid Details */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            {profileData.details.map((detail, i) =>
              detail.value ? (
                <div key={i}>
                  <p className="text-xs text-gray-500 uppercase">
                    {detail.label}
                  </p>
                  <p className="text-sm text-gray-300 capitalize">
                    {detail.value}
                  </p>
                </div>
              ) : null,
            )}
          </div>

          {/* Summary */}
          <div className="pt-4 border-t border-gray-700/50">
            <p className="text-base font-bold text-white mb-2">
              Professional Summary
            </p>
            <p className="text-sm text-gray-400 italic leading-relaxed">
              "{profileData.summary}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Request Consultation Modal
 * Handles the API call to create a consultation.
 */
export const RequestConsultModal = ({ attorney, closeModal }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: "Request for Consultation",
    message: "",
  });
  console.log(attorney);
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!attorney?.id) {
      toast.error("Error: Attorney information is missing.");
      return;
    }

    setLoading(true);
    const tokenData = localStorage.getItem("token");
    const tokens = JSON.parse(tokenData);
    if (!tokens?.accessToken) {
      toast.error("Authentication error. Please log in again.");
      setLoading(false);
      return;
    }
    const accessToken = tokens?.accessToken;

    const payload = {
      receiver_id: attorney.id,
      subject: formData.subject,
      message: formData.message,
    };

    try {
      const response = await axios.post(
        "http://10.10.7.19:8001/api/attorney/consultations/create/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 201 || response.status === 200) {
        toast.success("Consultation request sent successfully!");
        closeModal();
      }
    } catch (error) {
      console.error("API Error:", error.response?.data);
      const errorMsg =
        error.response?.data?.detail ||
        "Failed to send request. Please ensure you are logged in.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
      <div
        className={`${SECONDARY_BG_COLOR} p-6 sm:p-8 rounded-xl shadow-2xl max-w-lg w-full relative my-8`}
      >
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition rounded-full hover:bg-[#33363D]"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-white mb-2">
          Request Consultation
        </h2>
        <p className="text-gray-400 text-sm mb-6 border-b border-gray-700/50 pb-4">
          Sending to:{" "}
          <span className="text-blue-400 font-medium">
            {attorney?.full_name || "Attorney"}
          </span>
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Subject Field */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Subject
            </label>
            <input
              type="text"
              className={inputClasses}
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              required
            />
          </div>

          {/* Message Field */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Message
            </label>
            <textarea
              className={`${inputClasses} h-40 resize-none py-4`}
              placeholder="Describe your legal needs..."
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center p-4 rounded-lg text-white ${PRIMARY_COLOR_CLASSES} text-lg font-bold transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Sending...
              </>
            ) : (
              "Send Request"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
