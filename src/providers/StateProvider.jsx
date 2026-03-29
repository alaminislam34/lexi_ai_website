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
import Cookies from "js-cookie";

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

  const getStoredTokens = useCallback(() => {
    const accessTokenFromCookie = Cookies.get("accessToken");
    const refreshTokenFromCookie = Cookies.get("refreshToken");

    if (accessTokenFromCookie) {
      return {
        accessToken: accessTokenFromCookie,
        refreshToken: refreshTokenFromCookie,
      };
    }

    const storedToken = localStorage.getItem("token");
    if (!storedToken) return null;

    try {
      return JSON.parse(storedToken);
    } catch (error) {
      return null;
    }
  }, []);

  const fetchUser = useCallback(async () => {
    // 1. SSR Check: Ensure localStorage is available
    if (typeof window === "undefined") return;

    const tokens = getStoredTokens();
    if (!tokens?.accessToken) {
      setLoading(false);
      return;
    }

    try {
      const res = await baseApi.get(`${PROFILE_DETAILS}`, {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
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
  }, [getStoredTokens]);

  const logout = useCallback(async () => {
    const tokens = getStoredTokens();

    try {
      if (tokens?.accessToken) {
        const res = await baseApi.post(`/api/auth/logout/`, null, {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        });

        if (res.status === 200) {
          toast.success("Logged out successfully!");
        }
      }
    } catch (error) {
      toast.error("An error occurred while logging out. Please try again.");
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      router.push("/login");
    }
  }, [router, getStoredTokens]);

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
