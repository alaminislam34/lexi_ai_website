// src/components/Dashboard.jsx
"use client";

import { useAuth } from "@/app/providers/Auth_Providers/AuthProviders";
import AttorneyDashboard from "../components/dashboardComponents/AttorneyDashboard";
import ClientDashboard from "../components/dashboardComponents/ClientDashboard";

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <div className={`min-h-screen text-white`}>
      {user?.role === "client" ? <ClientDashboard /> : <AttorneyDashboard />}
    </div>
  );
}
