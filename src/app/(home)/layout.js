import "../globals.css";
import AuthProvider from "../providers/Auth_Providers/AuthProviders";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

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
          <section className="min-h-[80vh]">{children}</section>
          <Footer/>
        </AuthProvider>
      </body>
    </html>
  );
}
