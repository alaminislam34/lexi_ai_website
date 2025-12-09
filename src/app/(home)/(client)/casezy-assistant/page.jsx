"use client";

import { Send } from "lucide-react";
import React from "react";

export default function CasezyAssistant() {
  return (
    <div className="max-w-[1440px] mx-auto w-11/12 pt-28">
      <div className="flex justify-between items-center py-4">
        <p className="text-xl md:text-2xl ">Casezy Assistant</p>
        <button className="py-2 px-4 border rounded-lg border-gray/30 bg-BG/20">
          Close
        </button>
      </div>
      <br />
      <div className="space-y-4 h-[60vh] overflow-y-auto m-4 px-4">
        <div className="flex items-start">
          <p className="text-wrap text-left rounded-lg py-2 px-3 bg-secondary max-w-11/12 sm:max-w-9/12 md:max-w-7/12">
            Lorem ipsum dolor, sit possimus veniam consequatur
          </p>
        </div>
        <div className="flex justify-end text-left">
          <p className="text-left border rounded-lg py-2 px-3 bg-primary text-white max-w-11/12 sm:max-w-9/12 md:max-w-7/12">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ratione
            consequatur possimus veniam Lorem ipsum dolor, sit amet consectetur
          </p>
        </div>
        <div className="flex items-start">
          <p className="text-wrap text-left rounded-lg py-2 px-3 bg-secondary max-w-11/12 sm:max-w-9/12 md:max-w-7/12">
            Lorem ipsum dolor, siuatur possimus asdfsa dfsdaf asdf sadf sadfsad gasghsadgh sa veniam consequatur
          </p>
        </div>
        <div className="flex justify-end text-left">
          <p className="text-left border rounded-lg py-2 px-3 bg-primary text-white max-w-11/12 sm:max-w-9/12 md:max-w-7/12">
            consequatur possimus veniam Lorem ipsum dolor, sit amet consectetur
          </p>
        </div>
        <div className="flex items-start">
          <p className="text-wrap text-left rounded-lg py-2 px-3 bg-secondary max-w-11/12 sm:max-w-9/12 md:max-w-7/12">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ratione
            adipisicing elit. Ratione consequatur possimus veniam consequatur
          </p>
        </div>
        <div className="flex justify-end text-left">
          <p className="text-left border rounded-lg py-2 px-3 bg-primary text-white max-w-11/12 sm:max-w-9/12 md:max-w-7/12">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ratione
          </p>
        </div>
      </div>
      <div className="flex justify-between items-center space-x-3 p-4 sm:p-6 bg-secondary rounded-xl">
        <textarea
          placeholder="Ask the assistant...."
          className={`flex-1 p-3 rounded-lg resize-none text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-BG`}
          rows={1}
        />

        <button
          className={`p-3 rounded-lg text-white transition duration-300 bg-primary`}
          aria-label="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
