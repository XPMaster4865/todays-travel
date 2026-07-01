"use client";
import { useState } from "react";

const routes = [
  { number: "1", from: "Woodside Green", to: "Elmers End", type: "numbered" },
  { number: "2", from: "High Street", to: "Selhurst Park", type: "numbered" },
  { number: "3", from: "Manchester Beansgate", to: "South Croydon", type: "numbered" },
  { number: "4", from: "Thornton Heath Parchmore Road", to: "Waddon Marsh", type: "numbered" },
  { number: "5", from: "Woodside Green", to: "Thornton Heath Pond", type: "numbered" },
  { number: "6", from: "Waddon Marsh", to: "West Croydon", type: "numbered" },
  { number: "7", from: "Beddington", to: "Elmers End Superstore", type: "numbered" },
  { number: "8", from: "Elmers End Superstore", to: "Woodside Green", type: "numbered" },
  { number: "13", from: "Beddington Superstore", to: "Mitcham Common", type: "numbered" },
  { number: "GR", from: "Manchester Beansgate", to: "South Coombe Road", type: "gr" },
  { number: "GR2", from: "West Croydon", to: "West Hogarth Crescent", type: "gr" },
  { number: "GR3", from: "Manchester Beansgate", to: "West Croydon", type: "gr" },
  { number: "GR4", from: "Mitcham Common", to: "Beddington Superstore", type: "gr" },
  { number: "GR5", from: "Selhurst Park", to: "Parchmore Road", type: "gr" },
  { number: "T1", from: "Croydon Hospital", to: "West Croydon", type: "t" },
  { number: "T2", from: "Croydon Hospital", to: "West Croydon Bus Station", type: "t" },
  { number: "T3", from: "Croydon Hospital", to: "East Croydon", type: "t" },
  { number: "T4", from: "Croydon Hospital", to: "Mitcham Common", type: "t" },
  { number: "T5", from: "Croydon Hospital", to: "Thornton Heath Parchmore Road", type: "t" },
  { number: "T6", from: "Croydon Hospital", to: "Thornton Heath Parchmore Road", type: "t" },
  { number: "T7", from: "Croydon Hospital", to: "Lombard Roundabout", type: "t" },
  { number: "W17", from: "Lombard Roundabout", to: "Selhurst Park", type: "other" },
  { number: "BS1", from: "Beddington Superstore", to: "Thornton Heath Pond", type: "other" },
  { number: "P&R", from: "Selhurst Park", to: "Woodside Green", type: "other" },
  { number: "TC1", from: "Town Centre", to: "South End", type: "other" },
  { number: "🚌", from: "West Croydon", to: "South End", type: "other" },
];

const filters = [
  { label: "All", value: "all" },
  { label: "Numbered", value: "numbered" },
  { label: "GR Routes", value: "gr" },
  { label: "T Routes", value: "t" },
  { label: "Other", value: "other" },
];

export default function Routes() {
  const [active, setActive] = useState("all");

  const filtered = active === "all" ? routes : routes.filter((r) => r.type === active);

  return (
    <div className="max-w-5xl mx-auto px-4 py-24">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
        Our <span className="text-[#2dd4bf]">Routes</span>
      </h1>
      <p className="text-[#f0eaff]/50 text-lg mb-10">
        All custom routes currently operated by Todays Travel in Croydon Bus Simulator
      </p>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-3 mb-10">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setActive(f.value)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
              active === f.value
                ? "bg-[#8b3cf7] border-[#8b3cf7] text-white"
                : "border-purple-900/40 text-[#f0eaff]/60 hover:border-[#8b3cf7]/60 hover:text-[#f0eaff]"
            }`}
          >
            {f.label}
            <span className={`ml-2 text-xs ${active === f.value ? "text-white/70" : "text-[#f0eaff]/30"}`}>
              {f.value === "all" ? routes.length : routes.filter((r) => r.type === f.value).length}
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {filtered.map((r) => (
          <div
            key={r.number}
            className="flex items-center gap-6 rounded-2xl border border-purple-900/40 bg-[#130d24] p-5 hover:border-[#8b3cf7]/60 transition-colors"
          >
            <div className="shrink-0 w-16 h-16 rounded-xl bg-[#8b3cf7] flex items-center justify-center">
              <span className="text-sm font-extrabold text-white text-center leading-tight px-1">{r.number}</span>
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-bold text-[#f0eaff]">
                {r.from}{" "}
                <span className="text-[#c084fc]">→</span>{" "}
                {r.to}
              </p>
            </div>

            <div className="shrink-0 hidden sm:flex items-center gap-2 text-xs text-[#2dd4bf] bg-[#2dd4bf]/10 border border-[#2dd4bf]/20 rounded-lg px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf]" />
              Active
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-[#f0eaff]/30 text-sm mt-12">
        Route information is based on in-game services. Subject to change.
      </p>
    </div>
  );
}
