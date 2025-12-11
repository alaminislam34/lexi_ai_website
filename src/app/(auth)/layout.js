import AuthProvider from "../providers/Auth_Providers/AuthProviders";
import "../globals.css";
import { ToastContainer } from "react-toastify";
import StateProvider from "../providers/StateProvider";

export const metadata = {
  title: "Casezys || Sign in",
  description:
    "Casezys is Smart legal help for everyone. Elite tools for attorneys.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <AuthProvider>
          <StateProvider>
            {children}
            <ToastContainer autoClose={1500} position="top-center" />
          </StateProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
