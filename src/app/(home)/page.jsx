"use client";

import React from "react";
import ClientHomePage from "./components/client/ClientHomePage";
import AttorneyHomePage from "./components/attorney/AttorneyHomePage";
import { useContext } from "react";
// 1. Import StateContext (the named export with { }), NOT StateProvider
import { StateContext } from "../providers/StateProvider";
import { useRouter } from "next/navigation";

export default function HomePage() {
  // 2. Pass StateContext into the hook
  const { user, loading } = useContext(StateContext);
  const router = useRouter();
  if (!user && !loading) {
    return router.push("/login");
  }
  if (user?.role !== "user" && user?.role !== "attorney" && !loading) {
    return router.push("/login");
  }
  return (
    <div className="border border-transparent">
      {user?.role === "user" && <ClientHomePage />}
      {user?.role === "attorney" && <AttorneyHomePage />}
    </div>
  );
}
