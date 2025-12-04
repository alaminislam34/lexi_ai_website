"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
export const navlinks = [
  { name: "Home", link: "/client" },
  { name: "Ask Casezy", link: "/client/ask_casezy" },
  { name: "Attorney", link: "/client/attorneys" },
  { name: "Dashboard", link: "/client/dashboard" },
];
export default function Navbar() {
  const path = usePathname();
  const [scroll, setScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
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
      className={`py-4 fixed top-0 left-0 w-full ${
        scroll ? "bg-[#1d1d1d]" : "bg-transparent"
      }`}
    >
      <nav className="max-w-[1440px] mx-auto w-11/12 flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold text-primary font-lora">
            Casezys
          </h1>
        </div>
        <ul className="lg:flex flex-row items-center justify-center gap-6 hidden">
          {navlinks.map((nav, i) => (
            <li
              key={i}
              className={`${path === nav.link ? "text-primary" : "text-white"}`}
            >
              <Link href={nav.link}>{nav.name}</Link>
            </li>
          ))}
        </ul>
        <div>
          <Image
            src={"/images/user.jpg"}
            width={300}
            height={300}
            alt="Profile image"
            className="w-12 h-12 rounded-full bg-cover bg-center border border-gray-500 p-2"
          />
        </div>
      </nav>
    </div>
  );
}
