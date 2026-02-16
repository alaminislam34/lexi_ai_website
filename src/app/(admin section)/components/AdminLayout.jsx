import Sidebar from "./Sidebar";

const AdminDashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#0a0a0b]">
      <Sidebar />
      <main className="flex-1 transition-all duration-300 lg:pl-64">
        <div className="p-4 md:p-8 max-w-[1400px] mx-auto w-full pt-16 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardLayout;
