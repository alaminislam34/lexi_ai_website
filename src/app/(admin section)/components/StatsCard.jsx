const StatCard = ({ title, value, change, isPositive, icon: Icon }) => {
  return (
    <div className="bg-[#161618] p-6 rounded-xl border border-gray-800">
      <div className="flex justify-between items-start mb-4">
        <p className="text-gray-400 text-sm">{title}</p>
        <div className="text-[#00bcd4] bg-[#00bcd4]/10 p-2 rounded-lg">
          <Icon size={20} />
        </div>
      </div>
      <h3 className="text-3xl font-bold text-white mb-2">{value}</h3>
      <p className={`text-xs ${isPositive ? "text-cyan-400" : "text-red-400"}`}>
        {change} from last month
      </p>
    </div>
  );
};

export default StatCard;
