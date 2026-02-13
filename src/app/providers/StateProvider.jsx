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

// Create the Context
export const StateContext = createContext(undefined);

export default function StateProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state
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

  // Use an environment variable for the Base URL
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://3.141.14.219:8000";

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
      // Optional: Clear tokens if they are expired/invalid
      // localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Memoize the value to prevent unnecessary re-renders of all consuming components
  const value = useMemo(
    () => ({
      userData,
      setUserData,
      user,
      setUser,
      loading,
      refreshUser: fetchUser, // Allow components to manually refresh user data
    }),
    [userData, user, loading, fetchUser],
  );

  return (
    <StateContext.Provider value={value}>{children}</StateContext.Provider>
  );
}
