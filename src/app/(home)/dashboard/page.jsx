// src/components/Dashboard.jsx
"use client";

import { useAuth } from "@/app/providers/Auth_Providers/AuthProviders";
import Calendar from "../components/dashboardComponents/components/Calendar";
import MessageAndReceived from "../components/dashboardComponents/components/MessageAndReceived";
import QoutesDetails from "../components/dashboardComponents/components/QoutesDetails";

export default function ClientDashboard() {
  const { showModal } = useAuth();
  return (
    <div className={`min-h-screen text-white mt-26 md:mt-32`}>
      <div className="max-w-[1440px] mx-auto w-11/12 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <Calendar />
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
