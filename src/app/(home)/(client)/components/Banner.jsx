import { useAuth } from "@/app/providers/Auth_Providers/AuthProviders";
import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Banner() {
  const { user } = useAuth();
  return (
    <div className=" max-w-[1440px] mx-auto w-11/12 min-h-[95vh] flex items-center">
      <div className="space-y-6">
        <h1 className="font-lora text-3xl md:text-5xl lg:text-[56px] font-medium max-w-[850px] leading-normal">
          Smart legal help for everyone. Elite tools for attorneys.
        </h1>
        <p className="text-gray font-normal lg:text-xl py-4 max-w-[850px]">
          Casezy gives general legal information with citations, matches clients
          to verified attorneys, and equips lawyers with a powerful AI
          dashboard.
        </p>
        <div className="flex flex-row gap-6 items-center">
          <Link
            href={"/ask_casezy"}
            className="py-4 md:py-6 px-8 md:px-14 lg:px-16 rounded-2xl bg-primary text-white md:text-lg hover:bg-[#0c68fe] border border-primary duration-300"
          >
            Ask Casezy
          </Link>
          {user?.role === "client" && (
            <Link
              href={"/attorneys"}
              className="py-4 md:py-6 px-8 md:px-14 lg:px-16 rounded-2xl text-white border border-white md:text-lg hover:border-primary duration-300 hover:text-primary"
            >
              Attorney
            </Link>
          )}
        </div>
        <p className="flex items-center gap-2 text-sm">
          <TriangleAlert className="text-amber-500" /> Casezy provides general
          legal information only. Not legal advice.
        </p>
      </div>
    </div>
  );
}
