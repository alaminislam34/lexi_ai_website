"use client";

import { Search } from "lucide-react";
import Image from "next/image";

export const attorneys = [
  {
    image: "/images/user.jpg",
    name: "Jane Doe, Esq.",
    score: 3.7,
    title: "Describe your issue",
    practice_area: ["Criminal Defense", "DUI/OWI", "Expungement"],
    description: "Answer a few guided questions. No sensitive info required.",
  },
  {
    image: "/images/user.jpg",
    name: "Jane Doe, Esq.",
    score: 4.7,
    title: "Get general information",
    practice_area: ["Criminal Defense", "DUI/OWI", "Expungement"],
    description: "We cite official sources and explain options clearly.",
  },
  {
    image: "/images/user.jpg",
    name: "Jane Doe, Esq.",
    score: 5.0,
    title: "Connect to an attorney",
    practice_area: ["Criminal Defense", "DUI/OWI", "Expungement"],
    description: "Match with verified lawyers by practice area and ZIP.",
  },
];

export default function How_it_works() {
  return (
    <div className="max-w-[1440px] mx-auto w-11/12 pt-14 md:pt-24 lg:pt-28">
      <div className="flex justify-between">
        <header className="mb-6 space-y-1">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white leading-tight">
            Attorneys
          </h1>

          <p className="text-base text-gray">
            Filtered by: Family Law (Divorce, Custody)
          </p>
        </header>
        <div>
          <label className="relative">
            <Search className="absolute top-1/2 left-4 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Attorneys"
              className="py-4 pl-14 pr-6 border border-gray rounded-2xl"
            />
          </label>
        </div>
      </div>

      <br />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {attorneys.map((attorney, i) => (
          <div key={i} className="p-6 rounded-2xl bg-secondary space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <Image
                  src={attorney.image}
                  height={200}
                  width={200}
                  alt="User image"
                  className="w-16 h-16 p-2 border rounded-full"
                />
              </div>
              <div className="text-left">
                <h2 className="font-semibold leading-[26px] text-text_color">
                  {attorney.name}
                </h2>
                <p className="text-gray leading-normal">{attorney.title}</p>
              </div>
              <div>
                <span className="p-2 bg-element text-gray">
                  {attorney.score.toFixed(2)}
                </span>
              </div>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-4 text-gray">
                {attorney.practice_area.map((a, i) => (
                  <span key={i} className="py-1 px-2 rounded-lg bg-element">
                    {a}
                  </span>
                ))}
              </div>
              <ul className="">
                {attorney.practice_area.map((a, i) => (
                  <li key={i} className="text-gray">
                    {a}
                  </li>
                ))}
              </ul>
              <div className="flex space-x-4 pt-4">
                <button className="py-3 w-full rounded-lg text-white text-sm font-medium transition duration-300 hover:opacity-90 bg-primary">
                  Request Consult
                </button>
                <button className="py-3 w-full rounded-lg text-white text-sm font-medium border border-gray transition duration-300 hover:bg-gray-700">
                  View Profile
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
