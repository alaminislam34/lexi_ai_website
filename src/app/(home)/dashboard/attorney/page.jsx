"use client";

import { useAuth } from "@/app/providers/Auth_Providers/AuthProviders";
import Calendar from "../../components/dashboardComponents/components/Calendar";
import ConsultRequest from "../../components/attorney/ConsultRequest";
import SendQuoteModal from "../../components/dashboardComponents/components/SendQuoteModal";

export default function AttorneyDashboard() {
  const { showModal } = useAuth();

  const stats = [
    { id: 1, label: "Ongoing Clients", value: "10" },
    { id: 2, label: "New Leads", value: "3" },
    { id: 3, label: "Unread Messages", value: "3" },
  ];

  return (
    <div className="min-h-screen text-white mt-24 md:mt-32 pb-12 overflow-hidden bg-BG">
      <div className="max-w-[1440px] mx-auto w-11/12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <p>{showModal ? "Modal is open" : "Modal is closed"}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {stats.map((item) => (
                <div
                  key={item.id}
                  className="bg-secondary border border-gray-700/30 rounded-2xl p-6 flex flex-col justify-center transition-all duration-300 hover:scale-[1.02] hover:border-primary/50 group shadow-lg"
                >
                  <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">
                    {item.label}
                  </p>
                  <h2 className="text-white text-3xl font-bold font-lora">
                    {item.value}
                  </h2>
                </div>
              ))}
            </div>

            <div className="bg-secondary rounded-2xl p-2 md:p-6 shadow-xl border border-gray-700/20">
              <Calendar />
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <ConsultRequest />
          </div>
        </div>

        {showModal && <SendQuoteModal />}
      </div>
    </div>
  );
}
