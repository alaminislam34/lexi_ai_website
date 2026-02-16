"use client";
import { Users, Briefcase, Scale, Monitor } from "lucide-react";
import StatCard from "../components/StatsCard";
import { QuickStats, RecentActivity } from "../components/DashboardSections";

const AdminHomePage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Clients"
          value="0"
          change="0%"
          isPositive={true}
          icon={Briefcase}
        />
        <StatCard
          title="Total Attorneys"
          value="0"
          change="0%"
          isPositive={true}
          icon={Scale}
        />
        <StatCard
          title="Subscribed Users"
          value="0"
          change="0%"
          isPositive={true}
          icon={Monitor}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <RecentActivity />
        <QuickStats />
      </div>
    </div>
  );
};

export default AdminHomePage;
