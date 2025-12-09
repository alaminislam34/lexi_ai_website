"use client";

import Banner from "../../(client)/components/Banner";
import How_it_works from "../../(client)/components/How_it_works";

export default function AttorneyHomePage() {
  return (
    <div>
      <section className="bg-linear-to-br from-[#00000060] via-[#4750B725] to-[#4750B700] ">
        <Banner />
      </section>
      <How_it_works />
    </div>
  );
}
