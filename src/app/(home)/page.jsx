"use client";

import React from "react";
import { useAuth } from "../providers/Auth_Providers/AuthProviders";
import ClientHomePage from "./components/client/ClientHomePage";
import AttorneyHomePage from "./components/attorney/AttorneyHomePage";

export default function HomePage() {
  const { user } = useAuth();
  return (
    <div>
      {user?.role === "client" ? <ClientHomePage /> : <AttorneyHomePage />}
    </div>
  );
}
