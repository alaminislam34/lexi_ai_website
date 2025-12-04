"use client";
export const workStep = [
  {
    step: 1,
    title: "Describe your issue",
    description: "Answer a few guided questions. No sensitive info required.",
  },
  {
    step: 2,
    title: "Get general information",
    description: "We cite official sources and explain options clearly.",
  },
  {
    step: 3,
    title: "Connect to an attorney",
    description: "Match with verified lawyers by practice area and ZIP.",
  },
];
export default function How_it_works() {
  return (
    <div className="max-w-[1440px] mx-auto w-11/12 py-12">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold  leading-[26px] py-4 lg:py-6">
        How it works
      </h1>
      <br />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {workStep.map((w, i) => (
          <div
            key={i}
            className="p-6 lg:p-8 rounded-2xl bg-secondary space-y-4"
          >
            <div>
              <span className="py-4 px-7 rounded-2xl bg-[#FDFDFD1A] text-text_color inline-block ">
                {w.step}
              </span>
            </div>
            <h2 className="font-semibold leading-[26px] text-text_color">
              {w.title}
            </h2>
            <p className="text-gray leading-normal">{w.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
