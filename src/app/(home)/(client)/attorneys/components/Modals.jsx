import { ChevronDown, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { FaStar } from "react-icons/fa";

const PRIMARY_COLOR_CLASSES = "bg-blue-500 hover:bg-blue-600";
const SECONDARY_BG_COLOR = "bg-[#1D1F23]";
const TEXT_ELEMENT_BG = "bg-[#33363D]";
const inputClasses = `w-full p-4 border-none rounded-lg text-white text-base focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-500 appearance-none shadow-inner bg-[#12151B]`;

const SelectWrapper = ({ children }) => (
  <div className="relative">
     
    <select className={`${inputClasses} appearance-none cursor-pointer pr-10`}>
          {children} 
    </select>
     
    <ChevronDown className="absolute z-0 right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
  </div>
);

export const AttorneyProfileModal = ({
  attorney,
  closeModal,
  openConsultModal,
}) => {
  const handleRequestConsult = () => {
    openConsultModal();
    closeModal();
  };

  const profileData = {
    name: attorney.name,
    firm: "Doe Law PLLC",
    location: "Detroit, MI",
    score: attorney.score,
    quickFacts: [
      {
        label: "Responds in",
        value:
          attorney.description.find((d) => d.includes("Responds")) || "~2 hrs",
      },
      {
        label: "Experience",
        value:
          attorney.description.find((d) => d.includes("Experience")) ||
          "8+ years",
      },
      {
        label: "Languages",
        value:
          attorney.description.find((d) => d.includes("Languages")) ||
          "English, Spanish",
      },
    ],
    summary: attorney.description[attorney.description.length - 1],
    practice_area: attorney.practice_area,
    image: attorney.image,
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
       
      <div
        className={`${SECONDARY_BG_COLOR} rounded-2xl shadow-2xl max-w-xl w-full relative my-8`}
      >
         
        <button
          onClick={closeModal}
          className={`absolute -top-10 right-0 z-10 p-2 text-gray-400 hover:text-white transition rounded-full ${SECONDARY_BG_COLOR} hover:${TEXT_ELEMENT_BG}`}
          aria-label="Close Modal"
        >
              <X size={20} />     
        </button>
         
        <div className="p-6 sm:p-8 space-y-6">
           
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
             
            <div className="flex items-start space-x-4 min-w-0">
              <Image
                src={profileData.image}
                height={80}
                width={80}
                alt={profileData.name}
                className={`w-16 h-16 rounded-full object-cover p-1 border border-gray-700/50 shrink-0`}
              />

              <div className="flex flex-col min-w-0">
                <h2 className="text-xl font-bold text-white truncate">
                      {profileData.name}             
                </h2>

                <p className="text-sm text-gray-400 truncate">
                      {profileData.firm} • {profileData.location}       
                </p>
              </div>

              <div>
                <span
                  className={`text-xs text-gray-400 flex flex-row items-center gap-1 ${TEXT_ELEMENT_BG} py-1 px-2 rounded-lg mt-2 w-fit`}
                >
                   
                  <FaStar className="text-orange-400 w-3 h-3" />               
                  {profileData.score.toFixed(1)}             
                </span>
              </div>
            </div>
             
            <button
              onClick={handleRequestConsult}
              className={`px-6 py-2.5 rounded-lg text-white font-bold transition duration-300 w-full md:w-auto shrink-0 ${PRIMARY_COLOR_CLASSES}`}
            >
                Request Consult          
            </button>
          </div>
           
          <div className="space-y-3 pt-2 border-t border-gray-700/50">
             
            <p className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Practice Areas          
            </p>
             
            <div className="flex flex-wrap items-center gap-2">
              {profileData.practice_area.map((area, i) => (
                <span
                  key={i}
                  className={`py-1 px-3 rounded-full ${TEXT_ELEMENT_BG} text-sm text-white font-medium`}
                >
                      {area}             
                </span>
              ))}
            </div>
          </div>
           
          <div className="space-y-3 pt-3 border-t border-gray-700/50">
             <p className="text-base font-bold text-white">Quick Facts</p>   
            <ul className="space-y-2 text-sm text-gray-400">
              {profileData.quickFacts.map((fact, i) => (
                <li
                  key={i}
                  className="flex justify-between border-b border-gray-800 pb-1"
                >
                  {" "}
                   
                  <span className="font-semibold text-gray-300">
                          {fact.label}:                
                  </span>
                   <span>{fact.value.split(": ")[1] || fact.value}</span>   
                </li>
              ))}

              <li className="pt-4 text-gray-400 italic leading-relaxed">
                  &quot;{profileData.summary}&quot;            
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Request Consult Modal ---

export const RequestConsultModal = ({ closeModal }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      closeModal();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-opacity-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
       
      <div
        className={`${SECONDARY_BG_COLOR} p-6 sm:p-8 rounded-xl shadow-2xl max-w-6xl w-full relative my-8`}
      >
         
        <div className="flex justify-between items-center absolute top-2 right-2">
           
          <button
            onClick={closeModal}
            className={`p-2 text-gray-400 hover:text-white transition rounded-full hover:${TEXT_ELEMENT_BG}`}
            aria-label="Close Modal"
          >
                <X className="w-6 h-6" />       
          </button>
        </div>
         
        <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700/50 pb-4">
              Request Consultation      
        </h2>
         
        <form className="space-y-6" onSubmit={handleSubmit}>
           
          <div>
             
            <label
              htmlFor="state"
              className="block text-sm font-semibold mb-2 text-gray-300"
            >
                State          
            </label>
             
            <input
              type="text"
              id="state"
              className={inputClasses}
              placeholder="Michigan...."
              required
            />
          </div>
           
          <div>
             
            <label
              htmlFor="zip"
              className="block text-sm font-semibold mb-2 text-gray-300"
            >
                ZIP (Optional)          
            </label>
             
            <input
              type="text"
              id="zip"
              className={inputClasses}
              placeholder="e.g., 48226"
            />
          </div>
           
          <div>
             
            <label
              htmlFor="practiceArea"
              className="block text-sm font-semibold mb-2 text-gray-300"
            >
                Practice area          
            </label>
             
            <SelectWrapper>
                <option value="Criminal">Criminal</option>           {" "}
              <option value="Family">Family Law</option>           
              <option value="RealEstate">Real Estate</option>           
              <option value="Civil">Civil Litigation</option>         
            </SelectWrapper>
          </div>
           
          <div>
             
            <label
              htmlFor="description"
              className="block text-sm font-semibold mb-2 text-gray-300"
            >
                What happened?          
            </label>
             
            <textarea
              id="description"
              className={`${inputClasses} resize-none h-32`}
              placeholder="Briefly describe your situation (no sensitive details)"
              required
            />
          </div>
           
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center p-4 rounded-lg text-white ${PRIMARY_COLOR_CLASSES} text-lg font-bold transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-8 shadow-lg shadow-blue-500/30`}
          >
             
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />               
                Analyzing...            
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
