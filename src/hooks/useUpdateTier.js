/**
 * Custom React Query Hook for Updating Attorney Tier
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import baseApi from "@/api/base_url";
import { ALL_ATTORNEYS, UPDATE_ATTORNEY_TIER } from "@/api/apiEntpoint";

/**
 * Update attorney tier with optimistic updates
 */
export const useUpdateTier = (options) => {
  const { attorneyId, onSuccess, onError } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      try {
        const token =
          typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("token") || "{}")
            : {};

        // Convert empty string to null for API
        const payload = {
          tier: data.tier === "" ? null : data.tier,
        };

        const response = await baseApi.put(
          `${UPDATE_ATTORNEY_TIER(attorneyId)}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
              "Content-Type": "application/json",
            },
            timeout: 15000,
          },
        );

        if (!response.data) {
          throw new Error("Invalid response from server");
        }

        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const message =
            error.response?.data?.detail ||
            error.response?.data?.message ||
            error.message ||
            "Failed to update tier";
          throw new Error(message);
        }
        throw error;
      }
    },

    // Optimistic update
    onMutate: async (newData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["attorneys"] });

      // Snapshot the previous value
      const previousAttorneys = queryClient.getQueryData(["attorneys"]);

      // Convert empty string to null for consistency
      const tierValue = newData.tier === "" ? null : newData.tier;

      // Optimistically update to the new value
      queryClient.setQueryData(["attorneys"], (old) => {
        if (!old) return old;
        return {
          ...old,
          results: old.results.map((atty) =>
            atty.id === attorneyId ? { ...atty, tier: tierValue } : atty,
          ),
        };
      });

      return { previousAttorneys };
    },

    onError: (error, _variables, context) => {
      // Rollback on error
      if (context?.previousAttorneys) {
        queryClient.setQueryData(["attorneys"], context.previousAttorneys);
      }
      const message = error.message || "Failed to update tier";
      toast.error(message);
      onError?.(error);
    },

    onSuccess: (data) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["attorneys"] });
      toast.success("Tier updated successfully!");
      onSuccess?.(data);
    },
  });
};
