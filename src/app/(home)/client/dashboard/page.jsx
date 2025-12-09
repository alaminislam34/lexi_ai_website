// src/components/Dashboard.jsx
"use client";

import React, { useState } from "react";
import MessageAndReceived from "./components/MessageAndReceived";
import Calendar from "./components/Calendar";
import CasezyAssistant from "./components/CasezyAssistant";
import EventModal from "./components/QoutesDetails";

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className={`min-h-screen text-white`}>
      <div className="max-w-[1440px] mx-auto w-11/12 pt-14 md:pt-24 lg:pt-28 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <Calendar />
          </div>

          <div className="lg:col-span-2">
            <MessageAndReceived setShowModal={setShowModal} />
          </div>
        </div>
        <CasezyAssistant />
        {showModal && <EventModal setShowModal={setShowModal} />}
      </div>
    </div>
  );
}
