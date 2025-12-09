import { ToastContainer } from "react-toastify";
import "../globals.css";
import AuthProvider from "../providers/Auth_Providers/AuthProviders";
import Navbar from "./components/Shared/Navbar";
import Footer from "./components/Shared/Footer";
export const metadata = {
  title: "Casezy",
  description: "Smart legal help for everyone. Elite tools for attorneys.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <AuthProvider>
          <Navbar />
          <section className="min-h-[80vh] h-full">{children}</section>
          <Footer />
          <ToastContainer position="bottom-center" autoClose={1500} />
        </AuthProvider>
      </body>
    </html>
  );
}
