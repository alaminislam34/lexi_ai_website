"use client";

import DataTable from "../../components/DataTable";

const UsersPage = () => {
  // Define Table Columns
  const columns = [
    {
      header: "Name",
      accessor: "name",
      cell: (row) => <span className="text-white font-medium">{row.name}</span>,
    },
    { header: "Email", accessor: "email" },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            row.status === "Active"
              ? "bg-green-500/10 text-green-500"
              : "bg-red-500/10 text-red-500"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    { header: "Joined", accessor: "joined" },
  ];

  // Dummy Data
  const userData = [
    {
      name: "John Doe",
      email: "john@example.com",
      status: "Active",
      joined: "2024-01-15",
    },
    {
      name: "Jane Smith",
      email: "jane@example.com",
      status: "Active",
      joined: "2024-01-20",
    },
    {
      name: "Mike Johnson",
      email: "mike@example.com",
      status: "Inactive",
      joined: "2024-02-01",
    },
    {
      name: "Sarah Williams",
      email: "sarah@example.com",
      status: "Active",
      joined: "2024-02-05",
    },
    {
      name: "Tom Brown",
      email: "tom@example.com",
      status: "Active",
      joined: "2024-02-10",
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Users</h1>
        <p className="text-gray-500 mt-2">Manage all users in the system</p>
      </div>

      <DataTable
        title="All Users"
        subtitle="View and manage user accounts"
        columns={columns}
        data={userData}
      />
    </div>
  );
};

export default UsersPage;
