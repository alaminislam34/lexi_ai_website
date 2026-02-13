"use client";

import React from "react";
import ClientHomePage from "./components/client/ClientHomePage";
import AttorneyHomePage from "./components/attorney/AttorneyHomePage";
import { useContext } from "react";
// 1. Import StateContext (the named export with { }), NOT StateProvider
import { StateContext } from "../providers/StateProvider";

export default function HomePage() {
  // 2. Pass StateContext into the hook
  const { user } = useContext(StateContext);

  return (
    <div>
      {/* 3. Optional: Add a check to handle when user is loading/null */}
      {user?.role === "user" ? <ClientHomePage /> : <AttorneyHomePage />}
    </div>
  );
}
