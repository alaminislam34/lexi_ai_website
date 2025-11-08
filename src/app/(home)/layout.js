import "../globals.css";
import AuthProvider from "../providers/Auth_Providers/AuthProviders";

export const metadata = {
  title: "Casezy",
  description: "Smart legal help for everyone. Elite tools for attorneys.",
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
