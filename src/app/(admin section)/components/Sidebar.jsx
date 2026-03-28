"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Scale,
  Settings,
  Menu,
  X,
  LogOut, // Added LogOut icon
} from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
      link: "/admin",
    },
    {
      icon: <Briefcase size={20} />,
      label: "Clients",
      link: "/admin/clients",
    },
    {
      icon: <Scale size={20} />,
      label: "Attorneys",
      link: "/admin/attorneys",
    },
    {
      icon: <Settings size={20} />,
      label: "Settings",
      link: "/admin/settings",
    },
  ];

  // Logout handler
  const handleLogout = () => {
    // If you have auth logic (clearing cookies/tokens), add it here
    router.push("/admin-login");
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#00bcd4] text-black rounded-md shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Main */}
      <aside
        className={`
        fixed left-0 top-0 h-screen bg-[#0a0a0b] border-r border-gray-800 z-40 transition-transform duration-300 ease-in-out
        w-64 flex flex-col p-6
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Logo */}
        <div className="text-[#5dade2] text-3xl font-bold mb-10 px-2 mt-12 lg:mt-0">
          Casezys
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.link;

            return (
              <Link
                href={item.link}
                key={index}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  isActive
                    ? "bg-[#00bcd4] text-black font-semibold shadow-md shadow-[#00bcd4]/20"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Section: Profile + Logout */}
        <div className="mt-auto space-y-4">
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-lg text-red-400 hover:bg-red-400/10 hover:text-red-300 transition-all duration-200"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
