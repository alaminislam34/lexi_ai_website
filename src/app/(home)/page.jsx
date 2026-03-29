"use client";

import React, { useContext, useEffect } from "react";
import ClientHomePage from "./components/client/ClientHomePage";
import AttorneyHomePage from "./components/attorney/AttorneyHomePage";
// 1. Import StateContext (the named export with { }), NOT StateProvider
import { StateContext } from "../../providers/StateProvider";
import { useRouter } from "next/navigation";

export default function HomePage() {
  // 2. Pass StateContext into the hook
  const { user, loading } = useContext(StateContext);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user || (user.role !== "user" && user.role !== "attorney")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return null;
  }

  if (!user || (user.role !== "user" && user.role !== "attorney")) {
    return null;
  }

  return (
    <div className="border border-transparent">
      {user?.role === "user" && <ClientHomePage />}
      {user?.role === "attorney" && <AttorneyHomePage />}
    </div>
  );
}
