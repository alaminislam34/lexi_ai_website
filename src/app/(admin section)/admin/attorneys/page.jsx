"use client";

import { AttorneysTable } from "./components/AttorneysTable.jsx";

const AttorneysPage = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Attorneys</h1>
        <p className="text-gray-500 mt-2">
          View and manage attorney accounts and legal firms
        </p>
      </div>

      <AttorneysTable pageSize={10} />
    </div>
  );
};

export default AttorneysPage;
