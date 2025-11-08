import AuthProvider from "../providers/Auth_Providers/AuthProviders";
import "./globals.css";

export const metadata = {
  title: "Casezy || Sign in",
  description:
    "Casezy is Smart legal help for everyone. Elite tools for attorneys.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
