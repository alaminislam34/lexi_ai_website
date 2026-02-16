"use client";
import { Users, Briefcase, Scale, Monitor } from "lucide-react";
import StatCard from "../components/StatsCard";
import { QuickStats, RecentActivity } from "../components/DashboardSections";

const AdminHomePage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value="12,458"
          change="+12%"
          isPositive={true}
          icon={Users}
        />
        <StatCard
          title="Total Clients"
          value="3,245"
          change="+5%"
          isPositive={true}
          icon={Briefcase}
        />
        <StatCard
          title="Total Attorneys"
          value="1,890"
          change="-3%"
          isPositive={false}
          icon={Scale}
        />
        <StatCard
          title="Subscribed Users"
          value="8,765"
          change="+8%"
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
