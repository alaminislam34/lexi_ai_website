import Sidebar from "../components/Sidebar";
import AdminDashboardLayout from "../components/AdminLayout";

export const metadata = {
  title: "Casezys || Admin",
  description:
    "Casezys is Smart legal help for everyone. Elite tools for attorneys.",
};

export default function AdminRootLayout({ children }) {
  return (
    <>
      <div>
        <Sidebar />
        <AdminDashboardLayout>{children}</AdminDashboardLayout>
      </div>
    </>
  );
}
