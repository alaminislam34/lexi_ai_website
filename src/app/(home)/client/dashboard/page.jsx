// src/components/Dashboard.jsx
"use client";

import React from "react";
import MessageAndReceived from "./components/MessageAndReceived";
import Calendar from "./components/Calendar";

export default function Dashboard() {
  return (
    <div className={`min-h-screen text-white`}>
      <div className="max-w-[1440px] mx-auto w-11/12 pt-14 md:pt-24 lg:pt-28 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <Calendar />
          </div>

          <div className="lg:col-span-2">
            <MessageAndReceived />
          </div>
        </div>
      </div>
    </div>
  );
}
