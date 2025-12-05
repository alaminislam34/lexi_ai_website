"use client";

import React from "react";
import Banner from "./components/Banner";
import How_it_works from "./components/How_it_works";

export default function ClientPage() {
  return (
    <div>
      <section className="bg-linear-to-br from-[#00000060] via-[#4750B725] to-[#4750B700] ">
        <Banner />
      </section>
      <How_it_works />
    </div>
  );
}
