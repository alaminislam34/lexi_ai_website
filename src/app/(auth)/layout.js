import AuthProvider from "../providers/Auth_Providers/AuthProviders";
import "../globals.css";
import { ToastContainer } from "react-toastify";

export const metadata = {
  title: "Casezy || Sign in",
  description:
    "Casezy is Smart legal help for everyone. Elite tools for attorneys.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <AuthProvider>{children}
          <ToastContainer autoClose={1500} position="top-center"/>
        </AuthProvider> 
      </body>
    </html>
  );
}
