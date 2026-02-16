export const RecentActivity = () => {
  const activities = [
    { name: "John Doe", action: "Subscribed", time: "2 hours ago" },
    { name: "Jane Smith", action: "Updated profile", time: "4 hours ago" },
    { name: "Mike Johnson", action: "Made payment", time: "6 hours ago" },
    { name: "Sarah Williams", action: "Joined as client", time: "1 day ago" },
  ];

  return (
    <div className="bg-[#161618] p-6 rounded-xl border border-gray-800 flex-1">
      <h3 className="text-lg font-semibold text-white mb-1">Recent Activity</h3>
      <p className="text-gray-500 text-sm mb-6">
        User activity over the last 7 days
      </p>
      <div className="space-y-6">
        {activities.map((item, i) => (
          <div key={i} className="flex justify-between items-start">
            <div>
              <p className="text-white font-medium text-sm">{item.name}</p>
              <p className="text-gray-500 text-xs mt-1">{item.action}</p>
            </div>
            <span className="text-gray-600 text-xs">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const QuickStats = () => {
  const stats = [
    { label: "New Users", value: "+1,234", progress: 85 },
    { label: "Active Subscriptions", value: "+456", progress: 65 },
    { label: "Completed Cases", value: "+789", progress: 45 },
  ];

  return (
    <div className="bg-[#161618] p-6 rounded-xl border border-gray-800 w-full lg:w-96">
      <h3 className="text-lg font-semibold text-white mb-1">Quick Stats</h3>
      <p className="text-gray-500 text-sm mb-6">Monthly performance metrics</p>
      <div className="space-y-8">
        {stats.map((stat, i) => (
          <div key={i}>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400 text-sm">{stat.label}</span>
              <span className="text-white font-bold text-sm">{stat.value}</span>
            </div>
            <div className="w-full bg-gray-800 h-2 rounded-full">
              <div
                className="bg-[#00bcd4] h-2 rounded-full transition-all duration-500"
                style={{ width: `${stat.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
