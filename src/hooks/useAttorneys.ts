/**
 * Custom React Query Hook for Fetching Attorneys
 */

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios from "axios";

import { ALL_ATTORNEYS } from "@/api/apiEntpoint";
import baseApi from "@/api/base_url";

interface UseAttorneysOptions {
  page?: number;
  pageSize?: number;
  enabled?: boolean;
}

/**
 * Fetch attorneys from API with pagination support
 */
export const useAttorneys = (
  options: UseAttorneysOptions = { page: 1, pageSize: 10, enabled: true },
): UseQueryResult => {
  const { page = 1, pageSize = 10, enabled = true } = options;

  return useQuery({
    queryKey: ["attorneys", page, pageSize],
    queryFn: async () => {
      try {
        const token =
          typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("token") || "{}")
            : {};

        const response = await baseApi.get(
          `${ALL_ATTORNEYS}?page=${page}&page_size=${pageSize}`,
          {
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
              "Content-Type": "application/json",
            },
            timeout: 15000,
          },
        );

        if (!response.data || !Array.isArray(response.data.results)) {
          throw new Error("Invalid API response format");
        }

        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const message =
            error.response?.data?.detail ||
            error.response?.data?.message ||
            error.message ||
            "Failed to fetch attorneys";
          throw new Error(message);
        }
        throw error;
      }
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

/**
 * Refetch attorneys data
 */
export const useRefreshAttorneys = (queryClient: any) => {
  return () => {
    queryClient.invalidateQueries({ queryKey: ["attorneys"] });
  };
};
