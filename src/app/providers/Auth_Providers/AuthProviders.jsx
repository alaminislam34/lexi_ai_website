import React, { createContext, useContext, useState } from "react";

// Create context
export const AuthContext = createContext(null);

// Provider component
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // login function
  const login = (userData) => {
    setUser(userData);
  };

  // logout function
  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook for easy access
export const useAuth = () => useContext(AuthContext);
