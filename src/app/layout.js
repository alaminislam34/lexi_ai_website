import { ToastContainer } from "react-toastify";
import "./globals.css";
import ReactQueryProvider from "../providers/ReactQueryProvider";
import AuthProvider from "../providers/Auth_Providers/AuthProviders";
import StateProvider from "../providers/StateProvider";

export const metadata = {
  title: "Casezys",
  description:
    "Casezys is Smart legal help for everyone. Elite tools for attorneys.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <ReactQueryProvider>
          <AuthProvider>
            <StateProvider>
              {children}
              <ToastContainer autoClose={1500} position="top-center" />
            </StateProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
