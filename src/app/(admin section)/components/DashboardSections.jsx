export const RecentActivity = ({ activities = [], loading = false, error = "" }) => {

  return (
    <div className="bg-[#161618] p-6 rounded-xl border border-gray-800 flex-1">
      <h3 className="text-lg font-semibold text-white mb-1">Recent Activity</h3>
      <p className="text-gray-500 text-sm mb-6">
        User activity over the last 7 days
      </p>
      {loading ? (
        <p className="text-gray-400 text-sm">Loading activity...</p>
      ) : error ? (
        <p className="text-red-400 text-sm">Failed to load activity.</p>
      ) : activities.length === 0 ? (
        <p className="text-gray-400 text-sm">No recent activity.</p>
      ) : (
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
      )}
    </div>
  );
};

export const QuickStats = ({
  totalUsers = 0,
  totalAttorneys = 0,
  loading = false,
  error = "",
}) => {
  const safeUsers = Number(totalUsers) || 0;
  const safeAttorneys = Number(totalAttorneys) || 0;
  const totalAccounts = safeUsers + safeAttorneys;
  const denominator = totalAccounts || 1;

  const stats = [
    {
      label: "Total Users",
      value: loading ? "..." : String(safeUsers),
      progress: Math.min(100, Math.round((safeUsers / denominator) * 100)),
    },
    {
      label: "Total Attorneys",
      value: loading ? "..." : String(safeAttorneys),
      progress: Math.min(100, Math.round((safeAttorneys / denominator) * 100)),
    },
    {
      label: "Total Accounts",
      value: loading ? "..." : String(totalAccounts),
      progress: loading ? 0 : 100,
    },
  ];

  return (
    <div className="bg-[#161618] p-6 rounded-xl border border-gray-800 w-full lg:w-96">
      <h3 className="text-lg font-semibold text-white mb-1">Quick Stats</h3>
      <p className="text-gray-500 text-sm mb-6">Monthly performance metrics</p>
      {error ? <p className="text-red-400 text-xs mb-4">Failed to sync stats.</p> : null}
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
