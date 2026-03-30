import axios from "axios";
import Cookies from "js-cookie";

const resolveBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (envUrl) return envUrl;

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return "http://3.142.150.64";
};

const BASE_URL = resolveBaseUrl();

const REFRESH_ENDPOINT = "/api/token/refresh/";

const baseApi = axios.create({
  baseURL: BASE_URL,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// --- 1. Request Interceptor: Add Authorization Header ---
baseApi.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// --- 2. Response Interceptor: Handle Token Expiration and Refresh ---
baseApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check for 401 Unauthorized and the specific token expiration code
    if (
      error.response?.status === 401 &&
      error.response?.data?.code === "token_not_valid"
    ) {
      const refreshToken = Cookies.get("refreshToken");

      // If we don't have a refresh token or it's already a refresh request attempt, redirect
      if (!refreshToken || originalRequest._retry) {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        // Redirect using location for Next.js consistency if not in a server component
        window.location.href = "/login";
        return Promise.reject(error);
      }

      // Add the request to the queue and wait if a refresh is already in progress
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, originalRequest });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true; // Mark as retried
      isRefreshing = true;

      try {
        // Use the baseApi instance for the refresh call
        const refreshResponse = await baseApi.post(REFRESH_ENDPOINT, {
          refresh: refreshToken,
        });

        const { access, refresh } = refreshResponse.data;

        Cookies.set("accessToken", access);
        Cookies.set("refreshToken", refresh);

        // Update header for the original request and any queued requests
        baseApi.defaults.headers.common["Authorization"] = `Bearer ${access}`;
        processQueue(null, access);

        originalRequest.headers["Authorization"] = `Bearer ${access}`;
        return axios(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default baseApi;
