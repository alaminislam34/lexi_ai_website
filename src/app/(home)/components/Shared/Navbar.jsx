"use client";

import { useAuth } from "@/app/providers/Auth_Providers/AuthProviders";
import { LogOut, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
export const navlinks = [
  { name: "Home", link: "/" },
  { name: "Ask Casezy", link: "/ask_casezy" },
  { name: "Attorney", link: "/attorneys" },
  { name: "Message", link: "/message" },
  { name: "Dashboard", link: "/dashboard" },
];
export default function Navbar() {
  const path = usePathname();
  const [showMenu, setShowMenu] = useState(false);
  const [scroll, setScroll] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const { user, logout } = useAuth();
  console.log(user);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`py-4 z-50 fixed top-0 left-0 w-full duration-150 ${
        scroll ? "bg-[#1d1d1d]" : "bg-transparent backdrop-blur-2xl"
      }`}
    >
      <nav className="max-w-[1440px] mx-auto w-11/12 flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold text-primary font-lora">
            <Link href={"/"}>Casezys</Link>
          </h1>
        </div>
        <ul className="lg:flex flex-row items-center justify-center gap-14 hidden">
          {navlinks.map((nav, i) => (
            <li
              key={i}
              className={`${path === nav.link ? "text-primary" : "text-white hover:text-primary duration-300"}`}
            >
              <Link href={nav.link}>{nav.name}</Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4 relative">
          <Image
            onClick={() => {
              setShowUserModal(!showUserModal);
              if (showMenu) {
                setShowMenu(false);
              }
            }}
            src={"/images/user.jpg"}
            width={300}
            height={300}
            alt="Profile image"
            className="md:w-12 w-9 md:h-12 h-9 rounded-full bg-cover bg-center border border-gray-500 p-2 cursor-pointer"
          />
          {showUserModal && (
            <div className="absolute top-14 right-2 z-40 max-w-sm min-w-[280px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl ring-1 ring-gray-100 dark:ring-gray-700 p-5 transition-all duration-300 ease-in-out">
              {/* User Info Section */}
              <div className="pb-4 border-b border-gray-100 dark:border-gray-700 space-y-4">
                <div className="flex flex-col">
                  <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                    Name
                  </p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {user?.name || "Example User"}
                  </p>
                </div>

                <div className="flex flex-col">
                  <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                    Email
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                    {user?.email || "example@gmail.com"}
                  </p>
                </div>

                <div className="flex flex-col">
                  <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                    Role
                  </p>
                  <p className="text-sm font-medium">
                    {user?.role || "Member"}
                  </p>
                </div>
              </div>
              <Link href={'/profile'} onClick={() => setShowUserModal(false)} className="py-2 mt-2 inline-block hover:bg-gray/50 duration-300 rounded-xl px-4 w-full">Profile Details</Link>

              <div className="pt-6">
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-white hover:bg-red-600 dark:hover:bg-red-700 transition-colors duration-200 ease-in-out py-2 px-3 rounded-lg border border-red-500 dark:border-red-600 hover:border-transparent"
                >
                  <LogOut size={16} />
                  Log out
                </button>
              </div>
            </div>
          )}
          <div>
            <button
              onClick={() => {
                setShowMenu(!showMenu);
                if (showUserModal) {
                  setShowUserModal(false);
                }
              }}
              className="block lg:hidden cursor-pointer hover:text-white active:bg-primary hover:bg-primary p-2 duration-300 hover:border-primary active:scale-95 rounded-xl bg-transparent border border-gray"
            >
              <Menu size={18} />
            </button>
            {showMenu && (
              <div className="absolute top-14 right-2 z-40 max-w-sm min-w-[280px] rounded-2xl shadow-2xl bg-element p-6 transition-all duration-300 ease-in-out">
                <h1 className="text-2xl lg:text-3xl font-semibold text-primary font-lora">
                  <Link href={"/client"}>Casezys</Link>
                </h1>
                <br />
                <ul className="flex flex-col justify-center gap-2">
                  {navlinks.map((nav, i) => (
                    <li
                      onClick={() => {
                        if (showUserModal || showMenu) {
                          setShowUserModal(false);
                          setShowMenu(false);
                        }
                      }}
                      key={i}
                      className={` ${
                        path === nav.link ? "text-primary" : "text-white"
                      }`}
                    >
                      <Link
                        className="text-sm hover:bg-white/20 py-2 px-3 rounded-lg w-full inline-block duration-300"
                        href={nav.link}
                      >
                        {nav.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                <br />
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
