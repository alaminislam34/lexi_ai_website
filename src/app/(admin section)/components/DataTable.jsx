"use client";
import { useState } from "react";
import { Search } from "lucide-react";

const DataTable = ({ title, subtitle, columns, data }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = data.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  );

  return (
    <div className="bg-[#161618] rounded-xl border border-gray-800 overflow-hidden">
      {/* Header Section */}
      <div className="p-6">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <p className="text-gray-500 text-sm mt-1">{subtitle}</p>

        {/* Search Bar */}
        <div className="mt-6 relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1c1c1e] border border-gray-800 rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-[#00bcd4] transition-all"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
              {columns.map((col, index) => (
                <th key={index} className="px-6 py-4 font-semibold">
                  {col.header}
                </th>
              ))}
              <th className="px-6 py-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredData.length > 0 ? (
              filteredData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-white/2 transition-colors"
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-6 py-4 text-sm whitespace-nowrap"
                    >
                      {col.cell ? (
                        col.cell(row)
                      ) : (
                        <span className="text-gray-300">
                          {row[col.accessor]}
                        </span>
                      )}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-sm text-right">
                    <button className="text-[#00bcd4] hover:underline font-medium">
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-6 py-10 text-center text-gray-500"
                >
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
