// src/components/AttorneyList/AttorneyCard.jsx
import Image from "next/image";
import { FaStar } from "react-icons/fa";

const PRIMARY_COLOR_CLASSES = "bg-blue-500 hover:bg-blue-600";
const SECONDARY_BG_COLOR = "bg-[#1D1F23]";
const TEXT_ELEMENT_BG = "bg-[#33363D]";

export default function AttorneyCard({ attorney, openConsultModal, openProfileModal }) {
  return (
    <div className={`p-6 rounded-2xl ${SECONDARY_BG_COLOR} space-y-6 flex flex-col`}>
      <div className="flex items-start justify-between">
        <div className="flex flex-row items-center gap-4">
          <div className="shrink-0">
            <Image
              src={attorney.image}
              height={64}
              width={64}
              alt={`Profile of ${attorney.name}`}
              className="w-16 h-16 rounded-full object-cover p-1 border border-gray-700/50"
            />
          </div>
          <div className="text-left min-w-0">
            <h2 className="font-semibold text-white truncate">
              {attorney.name}
            </h2>
            <p className="text-sm text-gray-400 leading-normal truncate">
              {attorney.title}
            </p>
          </div>
        </div>

        <div>
          <span
            className={`shrink-0 text-xs text-gray-400 flex flex-row items-center gap-1 ${TEXT_ELEMENT_BG} py-1 px-2 rounded-lg ml-2`}
          >
            <FaStar className="text-orange-400 w-3 h-3" />
            {attorney.score.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="flex flex-col grow">
        <div className="flex flex-wrap items-center gap-2 text-gray-300 mb-4">
          {attorney.practice_area.map((a, index) => (
            <span
              key={index}
              className={`py-1 px-3 rounded-full ${TEXT_ELEMENT_BG} text-xs font-medium`}
            >
              {a}
            </span>
          ))}
        </div>

        {/* List of Descriptions/Quick Facts */}
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-400 grow">
            {attorney.description.map((item, i) => (
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