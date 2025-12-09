"use client";

import React from "react";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";

const PRIMARY_COLOR_CLASSES = "bg-blue-600 hover:bg-blue-700";
const TEXT_ELEMENT_BG = "bg-[#33363D]";

export default function CasezyAssistant() {
  const router = useRouter()
  const handlerSendMessage = () => {
    router.push("/casezy-assistant")
  }
  return (
    <div className={`py-12 text-white`}>
      <div
        className={`w-full max-w-4xl p-6 rounded-xl shadow-2xl bg-secondary flex flex-col space-y-4`}
      >
        <h2 className="text-xl font-bold">Casezy Assistant</h2>

        <div
          className={`p-4 rounded-xl self-start text-gray-300 rounded-tl-none ${TEXT_ELEMENT_BG}`}
        >
          <p className="text-sm">
            Hi! I can summarize filings or suggest next steps (general info).
            What would you like to do?
          </p>
        </div>

        <div className="flex items-end space-x-3 pt-2">
          <textarea
            placeholder="Ask the assistant...."
            className={`flex-1 p-3 rounded-lg resize-none text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none ${TEXT_ELEMENT_BG}`}
            rows={1}
          />

          <button
          onClick={() =>handlerSendMessage()}
            className={`p-3 rounded-lg text-white transition duration-300 ${PRIMARY_COLOR_CLASSES}`}
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* 3. Disclaimer */}
        <p className="text-xs text-gray mt-2">
          Demo only. General legal information. Do not share confidential
          information.
        </p>
      </div>
    </div>
  );
}
