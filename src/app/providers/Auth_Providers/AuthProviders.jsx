"use client";

import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

// Create context
export const AuthContext = createContext(null);

// Provider component
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("attorney@gmail.com");
  const [password, setPassword] = useState("attorney");
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const user = localStorage.getItem("user");
    const currentUser = JSON.parse(user);
    if (!user) {
      router.push("/login");
    }
    setUser(currentUser);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (email === "attorney@gmail.com" && password === "attorney") {
        const apiResponse = {
          accessToken: "actual_jwt_token_from_server",
          user: { name: "Al Amin Islam", email: email, role: "attorney" },
        };

        localStorage.setItem("user", JSON.stringify(apiResponse.user));
        toast.success("Logged in successful! Redirecting...");
        router.push("/");
      } else if (email === "client@gmail.com" && password === "client") {
        const apiResponse = {
          accessToken: "actual_jwt_token_from_server",
          user: { name: "Al Amin Islam", email: email, role: "client" },
        };

        localStorage.setItem("user", JSON.stringify(apiResponse.user));
        toast.success("Logged in successful! Redirecting...");
        router.push("/");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError(
        "An unexpected network error occurred. Please check your connection."
      );
    } finally {
      setLoading(false);
    }
  };

  // logout function
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setTimeout(() => {
      router.push("/login");
    }, 1000);
  };

  const value = {
    user,
    logout,
    isAuthenticated: !!user,
    handleSubmit,
    loading,
    error,
    setEmail,
    setPassword,
    email,
    password,
    showModal,
    setShowModal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook for easy access
export const useAuth = () => useContext(AuthContext);
