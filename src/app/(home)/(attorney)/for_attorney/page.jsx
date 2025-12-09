"use client";
export default function For_Attorney() {
  return (
    <div className="max-w-[1440px] mx-auto w-11/12 pt-28 h-[80vh]">
      <div className="flex items-center justify-center h-full ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex flex-col gap-4 bg-secondary p-6 md:p-8 rounded-2xl">
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-semibold">
                Dashboard Subscription
              </h1>
              <p className=" text-gray-400 leading-normal truncate">
                AI assistant, lead inbox, calendar, analytics. Cancel anytime.
              </p>
            </div>
            <p>
              <span className="text-3xl font-semibold">$199/</span>month
            </p>
            <div className="py-2">
              <button className="py-2 px-6 rounded-lg bg-primary text-white md:text-lg hover:bg-[#0c68fe] border border-primary duration-300">
                Start 14-day trial
              </button>
            </div>
            <ul className="flex flex-col list-inside list-disc text-gray ">
              <li>Drafts, summaries, checklists (general information)</li>
              <li>Lead inbox with auto triage</li>
              <li>Export to CRM & calendar sync</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
