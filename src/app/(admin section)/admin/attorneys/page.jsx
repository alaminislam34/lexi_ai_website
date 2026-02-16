"use client";

import DataTable from "../../components/DataTable";

const AttorneysPage = () => {
  // Define Table Columns specifically for Attorneys based on Figma design
  const columns = [
    {
      header: "Company",
      accessor: "company",
      cell: (row) => (
        <span className="text-white font-medium">{row.company}</span>
      ),
    },
    { header: "Contact", accessor: "contact" },
    { header: "Email", accessor: "email" },
    {
      header: "Cases",
      accessor: "cases",
      cell: (row) => (
        <span className="text-gray-300 font-mono">{row.cases}</span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            row.status === "Active"
              ? "bg-green-500/10 text-green-500 border border-green-500/20"
              : "bg-orange-500/10 text-orange-500 border border-orange-500/20"
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  // Data mapping based on your Attorneys Figma screenshot
  const attorneyData = [
    {
      company: "Acme Corporation",
      contact: "John Smith",
      email: "contact@acme.com",
      cases: 5,
      status: "Active",
    },
    {
      company: "Tech Innovations Inc",
      contact: "Sarah Johnson",
      email: "info@techinnovations.com",
      cases: 3,
      status: "Active",
    },
    {
      company: "Global Trading Ltd",
      contact: "Mike Chen",
      email: "legal@globaltrading.com",
      cases: 8,
      status: "Active",
    },
    {
      company: "Finance Partners LLC",
      contact: "Emma Davis",
      email: "admin@financepartners.com",
      cases: 2,
      status: "Inactive",
    },
    {
      company: "Healthcare Solutions",
      contact: "Robert Wilson",
      email: "support@healthcaresol.com",
      cases: 6,
      status: "Active",
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Attorneys</h1>
        <p className="text-gray-500 mt-2">
          View and manage attorney accounts and legal firms
        </p>
      </div>

      <DataTable
        title="All Attorneys"
        subtitle="View and manage client accounts"
        columns={columns}
        data={attorneyData}
      />
    </div>
  );
};

export default AttorneysPage;
