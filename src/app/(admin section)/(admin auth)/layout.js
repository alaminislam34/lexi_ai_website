import AuthProvider from "../../../providers/Auth_Providers/AuthProviders";
import "../../globals.css";
import StateProvider from "../../../providers/StateProvider";

export const metadata = {
  title: "Casezys || Sign in",
  description:
    "Casezys is Smart legal help for everyone. Elite tools for attorneys.",
};

export default function RootLayout({ children }) {
  return (
    <>
      <div>
        <AuthProvider>
          <StateProvider>{children}</StateProvider>
        </AuthProvider>
      </div>
    </>
  );
}
