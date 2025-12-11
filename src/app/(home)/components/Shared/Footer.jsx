"use client";

import Link from "next/link";
import React from "react";

export default function Footer() {
  const footerLinks = [
    {
      title: "Quick Links",
      links: [
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" },
        { name: "About us", href: "/about" },
        { name: "Contact us", href: "/contact" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Contact Support", href: "/support" },
      ],
    },
  ];

  return (
    <footer>
      <div className="max-w-[1440px] mx-auto w-11/12 py-10 md:py-16 lg:py-24 mt-6">
        <div className="flex flex-wrap justify-between items-start gap-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-primary font-lora">
              Casezys
            </h2>
            <p className="text-gray-400 max-w-md">
              Casezys gives general legal information with citations, matches
              clients to verified attorneys, and equips lawyers with a powerful
              AI dashboard.
            </p>
          </div>

          <div className="space-y-4 md:col-span-1">
            <h3 className="text-lg font-semibold text-white">
              {footerLinks[0].title}
            </h3>
            <ul className="space-y-2">
              {footerLinks[0].links.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-primary transition duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 md:col-span-1">
            <h3 className="text-lg font-semibold text-white">
              {footerLinks[1].title}
            </h3>
            <ul className="space-y-2">
              {footerLinks[1].links.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-primary transition duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
