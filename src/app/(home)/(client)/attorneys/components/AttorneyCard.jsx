import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { Check } from "lucide-react";

const PRIMARY_COLOR_CLASSES = "bg-blue-500 hover:bg-blue-600";
const SECONDARY_BG_COLOR = "bg-[#1D1F23]";
const TEXT_ELEMENT_BG = "bg-[#33363D]";

export default function AttorneyCard({
  attorney,
  openConsultModal,
  openProfileModal,
}) {
  const name = attorney.full_name;
  const image = attorney.profile_image;
  const score = attorney.rating?.average;
  const legalArea = attorney.preferred_legal_area;
  const practiceAreas = attorney.preferred_legal_area
    ? [attorney.preferred_legal_area]
    : ["Legal Services"];

  const descriptionItems = [
    `Location: ${attorney.location || "Not specified"}`,
    `Member since: ${attorney.date_joined ? new Date(attorney.date_joined).getFullYear() : "2026"}`,
  ];

  return (
    <div
      className={`p-6 rounded-2xl ${SECONDARY_BG_COLOR} space-y-6 flex flex-col`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-row items-center gap-4 flex-1">
          <div className="shrink-0 relative">
            <Image
              src={image}
              height={64}
              width={64}
              alt={name}
              className="w-16 h-16 rounded-full object-cover p-1 border border-gray-700/50"
            />
            {attorney.is_mock && (
              <div className="absolute bottom-0 right-0 flex items-center justify-center w-5 h-5 bg-blue-500 rounded-full border-2 border-[#1D1F23]">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          <div className="text-left min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-white truncate">{name}</h2>
              {attorney.is_mock && (
                <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/30 rounded text-blue-400 text-xs font-medium whitespace-nowrap">
                  Matched
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400 leading-normal truncate">
              {legalArea}
            </p>
            {attorney.is_mock && attorney.tier_match_reason && (
              <p className="text-xs text-blue-300/70 mt-1">
                {attorney.tier_match_reason}
              </p>
            )}
          </div>
        </div>
        <div>
          <span
            className={`shrink-0 text-xs text-gray-400 flex flex-row items-center gap-1 ${TEXT_ELEMENT_BG} py-1 px-2 rounded-lg ml-2`}
          >
            <FaStar className="text-orange-400 w-3 h-3" />
            {Number(score).toFixed(1)}
          </span>
        </div>
      </div>

      <div className="flex flex-col grow">
        <div className="flex flex-wrap items-center gap-2 text-gray-300 mb-4">
          {practiceAreas.map((area, index) => (
            <span
              key={index}
              className={`py-1 px-3 rounded-full ${TEXT_ELEMENT_BG} text-xs font-medium`}
            >
              {area}
            </span>
          ))}
        </div>

        <ul className="list-disc list-inside space-y-1 text-sm text-gray-400 grow">
          {descriptionItems.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        <div className="flex space-x-4 pt-4 mt-auto">
          <button
            onClick={openConsultModal}
            className={`py-3 w-full rounded-lg text-white text-sm font-bold transition duration-300 ${PRIMARY_COLOR_CLASSES} flex-1`}
          >
            Request Consult
          </button>
          <button
            onClick={() => openProfileModal(attorney)}
            className="py-3 w-full rounded-lg text-white text-sm font-bold border border-gray-700 transition duration-300 hover:bg-gray-700 flex-1"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
}
