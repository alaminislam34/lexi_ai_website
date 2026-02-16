const StatCard = ({ title, value, change, isPositive, icon: Icon }) => {
  return (
    <div className="bg-[#161618] p-4 md:p-6 rounded-xl border border-gray-800 relative">
      <div className="flex justify-between items-start mb-4">
        <p className="text-gray-400 text-sm">{title}</p>
      </div>
      <div className="text-[#00bcd4] absolute top-4 right-4 opacity-50">
        <Icon size={50} />
      </div>
      <h3 className="text-xl md:text-3xl font-bold text-white mb-2">{value}</h3>
      <p className={`text-xs ${isPositive ? "text-cyan-400" : "text-red-400"}`}>
        {change} from last month
      </p>
    </div>
  );
};

export default StatCard;
