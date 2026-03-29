"use client";
import { useCallback, useEffect, useState } from "react";
import { Users, Scale } from "lucide-react";
import StatCard from "../components/StatsCard";
import { QuickStats, RecentActivity } from "../components/DashboardSections";
import baseApi from "../../../api/base_url";
import { ALL_ATTORNEYS, ALL_USERS } from "../../../api/apiEntpoint";

const AdminHomePage = () => {
  const [stats, setStats] = useState({
    total_users: 0,
    total_attorneys: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatRelativeTime = useCallback((dateString) => {
    if (!dateString) return "Recently";

    const now = Date.now();
    const createdAt = new Date(dateString).getTime();
    if (Number.isNaN(createdAt)) return "Recently";

    const diffMs = now - createdAt;
    const minutes = Math.floor(diffMs / (1000 * 60));
    if (minutes < 60) return `${Math.max(1, minutes)} min ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }, []);

  const getCount = useCallback((payload, primaryKey) => {
    if (!payload) return 0;

    return (
      payload[primaryKey] ??
      payload?.stats?.[primaryKey] ??
      payload?.pagination?.count ??
      payload?.count ??
      (Array.isArray(payload?.results) ? payload.results.length : 0)
    );
  }, []);

  const fetchDashboardStats = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [usersRes, attorneysRes] = await Promise.all([
        baseApi.get(`${ALL_USERS}?page=1&page_size=4`),
        baseApi.get(`${ALL_ATTORNEYS}?page=1&page_size=1`),
      ]);

      const recentUsers = Array.isArray(usersRes?.data?.results)
        ? usersRes.data.results
        : [];

      setStats({
        total_users: getCount(usersRes?.data, "total_users"),
        total_attorneys: getCount(attorneysRes?.data, "total_attorneys"),
      });

      setRecentActivity(
        recentUsers.map((user) => ({
          name:
            user?.full_name?.trim() || user?.email?.split("@")[0] || "User",
          action: "Joined platform",
          time: formatRelativeTime(user?.created_at),
        })),
      );
    } catch (err) {
      setError("Failed to load dashboard stats.");
    } finally {
      setLoading(false);
    }
  }, [getCount, formatRelativeTime]);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>

      {error ? <p className="text-red-400 mb-6 text-sm">{error}</p> : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={loading ? "..." : String(stats.total_users)}
          change={error ? "Error" : "Live"}
          isPositive={true}
          icon={Users}
        />
        <StatCard
          title="Total Attorneys"
          value={loading ? "..." : String(stats.total_attorneys)}
          change={error ? "Error" : "Live"}
          isPositive={!error}
          icon={Scale}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <RecentActivity
          activities={recentActivity}
          loading={loading}
          error={error}
        />
        <QuickStats
          totalUsers={stats.total_users}
          totalAttorneys={stats.total_attorneys}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
};

export default AdminHomePage;
