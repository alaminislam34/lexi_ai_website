import "../globals.css";
import Navbar from "./components/Shared/Navbar";
import Footer from "./components/Shared/Footer";
export const metadata = {
  title: "Casezys",
  description: "Smart legal help for everyone. Elite tools for attorneys.",
};

export default function RootLayout({ children }) {
  return (
    <>
      <div>
        <Navbar />
        <section className="min-h-[80vh] overflow-hidden h-full">
          {children}
        </section>
        <Footer />
      </div>
    </>
  );
}
