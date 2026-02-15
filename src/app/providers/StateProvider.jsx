"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import axios from "axios";
import { PROFILE_DETAILS } from "@/api/apiEntpoint";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

// Create the Context
export const StateContext = createContext(undefined);

export default function StateProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [userData, setUserData] = useState({
    email: "",
    username: "",
    password: "",
    password_confirm: "",
    full_name: "",
    role: "",
    location: "",
    preferred_legal_area: "",
    gender: "",
  });
  const router = useRouter();

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://10.10.7.19:8002";

  const fetchUser = useCallback(async () => {
    // 1. SSR Check: Ensure localStorage is available
    if (typeof window === "undefined") return;

    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      const token = JSON.parse(storedToken);

      if (!token?.accessToken) throw new Error("No access token");

      const res = await axios.get(`${API_BASE_URL}${PROFILE_DETAILS}`, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      });

      if (res.status === 200) {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      }
    } catch (error) {
      console.error("Auth Error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  const logout = useCallback(async () => {
    const tokens = JSON.parse(localStorage.getItem("token"));
    if (!tokens?.accessToken) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/login");
      return;
    }
    const res = await axios.post(`${API_BASE_URL}/api/auth/logout/`, null, {
      headers: { Authorization: `Bearer ${tokens.accessToken}` },
    });
    if (res.status === 200) {
      toast.success("Logged out successfully!");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/login");
    } else {
      toast.error("An error occurred while logging out. Please try again.");
    }
  }, [API_BASE_URL, router]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const value = useMemo(
    () => ({
      userData,
      setUserData,
      user,
      setUser,
      loading,
      logout,
      refreshUser: fetchUser,
    }),
    [userData, user, loading, logout, fetchUser],
  );

  return (
    <StateContext.Provider value={value}>{children}</StateContext.Provider>
  );
}
