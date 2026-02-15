"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import ChatLayout from "@/components/chat/ChatLayout";

const getJwtToken = () => {
  if (typeof window === "undefined") return "";
  try {
    const tokenData = JSON.parse(localStorage.getItem("token") || "{}");
    return tokenData?.accessToken || "";
  } catch {
    return "";
  }
};

const decodeTokenPayload = (token) => {
  if (!token) return null;
  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return null;
    const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(""),
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
};

const getLoggedUserId = (token) => {
  if (typeof window === "undefined") return "";

  try {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (storedUser?.id) return storedUser.id;
    if (storedUser?.user_id) return storedUser.user_id;
  } catch {}

  const payload = decodeTokenPayload(token);
  return payload?.user_id || payload?.id || "";
};

const getRole = () => {
  if (typeof window === "undefined") return "user";

  try {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (storedUser?.role === "attorney") return "attorney";
  } catch {}

  return "user";
};

export default function ClientMessagePage() {
  const searchParams = useSearchParams();

  const consultationId = useMemo(
    () =>
      searchParams.get("consultationId") ||
      searchParams.get("consultation_id") ||
      searchParams.get("id") ||
      "",
    [searchParams],
  );

  const jwtToken = useMemo(() => getJwtToken(), []);
  const loggedUserId = useMemo(() => getLoggedUserId(jwtToken), [jwtToken]);
  const role = useMemo(() => getRole(), []);

  return (
    <ChatLayout
      consultationId={consultationId}
      loggedUserId={loggedUserId}
      jwtToken={jwtToken}
      role={role}
    />
  );
}
