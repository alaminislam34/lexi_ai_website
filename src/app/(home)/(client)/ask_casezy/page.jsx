'use client'

import { useAuth } from "@/app/providers/Auth_Providers/AuthProviders";
import React from "react";
import Ask_Casezy_Attorney from "./components/AttorneyPage";
import Ask_Casezy_Client from "./components/ClientPage";

export default function Ask_Casezy() {
  const { user } = useAuth();
  return (
    <div>
      {user?.role === "attorney" ? (
        <Ask_Casezy_Attorney />
      ) : (
        <Ask_Casezy_Client />
      )}
    </div>
  );
}
