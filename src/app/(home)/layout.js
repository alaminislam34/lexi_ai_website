import { ToastContainer } from "react-toastify";
import "../globals.css";
import AuthProvider from "../providers/Auth_Providers/AuthProviders";
import Navbar from "./components/Shared/Navbar";
import Footer from "./components/Shared/Footer";
import StateProvider from "../providers/StateProvider";
import ReactQueryProvider from "../providers/ReactQueryProvider";
export const metadata = {
  title: "Casezys",
  description: "Smart legal help for everyone. Elite tools for attorneys.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <ReactQueryProvider>
          <StateProvider>
            <AuthProvider>
              <Navbar />
              <section className="min-h-[80vh] overflow-hidden h-full">
                {children}
              </section>
              <Footer />
              <ToastContainer position="bottom-center" autoClose={1500} />
            </AuthProvider>
          </StateProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
