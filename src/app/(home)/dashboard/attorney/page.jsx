// src/components/Dashboard.jsx
"use client";

import { useAuth } from "@/app/providers/Auth_Providers/AuthProviders";
import Calendar from "./components/Calendar";
import CasezyAssistant from "./components/CasezyAssistant";
import QoutesDetails from "./components/QoutesDetails";
import ConsultRequest from "../attorney/ConsultRequest";
import SendQuoteModal from "./components/SendQuoteModal";

export default function AttorneyDashboard() {
  const { showModal, user } = useAuth();
  return (
    <div className={`min-h-screen text-white`}>
      <div className="max-w-[1440px] mx-auto w-11/12  pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
          <div className="lg:col-span-4">
            <Calendar />
            <CasezyAssistant />
          </div>

          <div className="lg:col-span-2">
            <ConsultRequest />
          </div>
        </div>
        {showModal &&
          (user?.role === "user" ? <QoutesDetails /> : <SendQuoteModal />)}
      </div>
    </div>
  );
}
