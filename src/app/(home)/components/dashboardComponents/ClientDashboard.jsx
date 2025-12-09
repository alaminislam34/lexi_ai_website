// src/components/Dashboard.jsx
"use client";

import Calendar from "./components/Calendar";
import MessageAndReceived from "./components/MessageAndReceived";
import CasezyAssistant from "./components/CasezyAssistant";
import QoutesDetails from "./components/QoutesDetails";
import { useAuth } from "@/app/providers/Auth_Providers/AuthProviders";

export default function ClientDashboard() {
  const { showModal } = useAuth();
  return (
    <div className={`min-h-screen text-white`}>
      <div className="max-w-[1440px] mx-auto w-11/12  pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <Calendar />
            <CasezyAssistant />
          </div>

          <div className="lg:col-span-2">
            <MessageAndReceived />
          </div>
        </div>
        {showModal && <QoutesDetails />}
      </div>
    </div>
  );
}
