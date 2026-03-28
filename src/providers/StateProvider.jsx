"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import baseApi from "../api/base_url";
import { PROFILE_DETAILS } from "../api/apiEntpoint";

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

      const res = await baseApi.get(`${PROFILE_DETAILS}`, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      });
      console.log(res);
      if (res.status === 200) {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      }
    } catch (error) {
      console.error("Auth Error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    const tokens = JSON.parse(localStorage.getItem("token"));
    if (!tokens?.accessToken) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/login");
      return;
    }
    const res = await baseApi.post(`/api/auth/logout/`, null, {
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
  }, [router]);

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
