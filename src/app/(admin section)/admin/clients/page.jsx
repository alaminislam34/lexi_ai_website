"use client";

import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import baseApi from "../../../../api/base_url";
import { ALL_USERS } from "../../../../api/apiEntpoint";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Users,
} from "lucide-react";
import { Button } from "../../../../components/ui/Button";

const UsersPage = () => {
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin-users", currentPage, pageSize],
    queryFn: async () => {
      try {
        const token =
          typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("token") || "{}")
            : {};

        const response = await baseApi.get(
          `${ALL_USERS}?page=${currentPage}&page_size=${pageSize}`,
          {
            headers: {
              Authorization: token?.accessToken
                ? `Bearer ${token.accessToken}`
                : undefined,
              "Content-Type": "application/json",
            },
            timeout: 15000,
          },
        );

        if (!response?.data || !Array.isArray(response.data.results)) {
          throw new Error("Invalid users response format");
        }

        return response.data;
      } catch (queryError) {
        if (axios.isAxiosError(queryError)) {
          const message =
            queryError.response?.data?.detail ||
            queryError.response?.data?.message ||
            queryError.message ||
            "Failed to load users";
          throw new Error(message);
        }
        throw queryError;
      }
    },
    staleTime: 60 * 1000,
    retry: 2,
  });
  const rows = useMemo(() => data?.results ?? [], [data]);
  const pagination = data?.pagination;
  const stats = data?.stats;

  const hasPrevious = (pagination?.current_page || 1) > 1;
  const hasNext =
    (pagination?.current_page || 1) < (pagination?.total_pages || 1);
  const totalUsers = pagination?.count || 0;
  const startIndex = totalUsers === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalUsers);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDisplayName = (user) => {
    const fullName = user?.full_name?.trim();
    if (fullName) return fullName;

    const emailPrefix = user?.email?.split("@")[0];
    return emailPrefix || "Unnamed User";
  };

  const goPrevious = () => {
    if (!hasPrevious) return;
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const goNext = () => {
    if (!hasNext) return;
    setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Users</h1>
        <p className="text-gray-500 mt-2">Manage all users in the system</p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center h-64 rounded-xl border border-gray-800 bg-[#161618]">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500 mx-auto mb-3" />
            <p className="text-gray-400">Loading users...</p>
          </div>
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center">
          <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-red-400 mb-2">
            Error Loading Users
          </h3>
          <p className="text-red-300 mb-4">
            {error?.message || "An unexpected error occurred"}
          </p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <div className="overflow-x-auto rounded-xl border border-gray-800 bg-[#161618]">
            <div className="px-6 py-5 border-b border-gray-800 bg-[#1c1c1e]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">All Users</h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Showing {startIndex} to {endIndex} of {totalUsers} users
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Active / Inactive
                  </p>
                  <p className="text-sm text-white font-semibold">
                    {stats?.active_users ?? 0} / {stats?.inactive_users ?? 0}
                  </p>
                </div>
              </div>
            </div>

            {rows.length === 0 ? (
              <div className="py-14 px-6 text-center">
                <Users className="h-10 w-10 text-gray-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-300 mb-1">
                  No Users Found
                </h3>
                <p className="text-sm text-gray-500">
                  There are no users on this page.
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Name</th>
                    <th className="px-6 py-4 font-semibold">Email</th>
                    <th className="px-6 py-4 font-semibold">Gender</th>
                    <th className="px-6 py-4 font-semibold">Verification</th>
                    <th className="px-6 py-4 font-semibold">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {rows.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-white/2 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                        <span className="text-white font-medium">
                          {getDisplayName(user)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-300">
                        {user.email || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-300 capitalize">
                        {user.gender || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.email_verified
                              ? "bg-green-500/10 text-green-500"
                              : "bg-yellow-500/10 text-yellow-500"
                          }`}
                        >
                          {user.email_verified ? "Verified" : "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-300">
                        {formatDate(user.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {pagination?.total_pages > 1 && (
            <div className="mt-6 flex items-center justify-between p-4 rounded-lg border border-gray-700 bg-gray-800/20">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goPrevious}
                  disabled={!hasPrevious}
                  icon={<ChevronLeft className="h-4 w-4" />}
                >
                  Previous
                </Button>

                <span className="text-sm text-gray-400 px-2">
                  Page{" "}
                  <span className="font-semibold text-white">
                    {pagination.current_page}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-white">
                    {pagination.total_pages}
                  </span>
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={goNext}
                  disabled={!hasNext}
                  icon={<ChevronRight className="h-4 w-4" />}
                >
                  Next
                </Button>
              </div>

              <div className="text-sm text-gray-400">
                Total:{" "}
                <span className="font-semibold text-white">{totalUsers}</span>{" "}
                users
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UsersPage;
