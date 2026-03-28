/**
 * Storage-based Admin Authentication Utility
 * Manages admin authentication tokens from localStorage
 */

export interface AdminAuthToken {
  accessToken: string;
  refreshToken?: string;
}

/**
 * Get admin auth token from localStorage
 */
export const getAdminToken = (): AdminAuthToken | null => {
  if (typeof window === "undefined") return null;

  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return JSON.parse(token);
  } catch (error) {
    console.error("Failed to parse auth token:", error);
    return null;
  }
};

/**
 * Check if admin is authenticated
 */
export const isAdminAuthenticated = (): boolean => {
  const token = getAdminToken();
  return !!(token?.accessToken);
};

/**
 * Get admin access token
 */
export const getAccessToken = (): string | null => {
  const token = getAdminToken();
  return token?.accessToken || null;
};
