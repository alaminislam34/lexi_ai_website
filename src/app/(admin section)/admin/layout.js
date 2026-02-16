import AuthProvider from "../../providers/Auth_Providers/AuthProviders";
import "../../globals.css";
import { ToastContainer } from "react-toastify";
import StateProvider from "../../providers/StateProvider";
import Sidebar from "../components/Sidebar";
import AdminDashboardLayout from "../components/AdminLayout";

export const metadata = {
  title: "Casezys || Admin",
  description:
    "Casezys is Smart legal help for everyone. Elite tools for attorneys.",
};

export default function AdminRootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <AuthProvider>
          <StateProvider>
            <Sidebar />
            <AdminDashboardLayout>{children}</AdminDashboardLayout>
            <ToastContainer autoClose={1500} position="top-center" />
          </StateProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
