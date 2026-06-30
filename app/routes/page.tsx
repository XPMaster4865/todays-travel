const routes = [
  { number: "119", from: "Croydon Town Centre", to: "Thornton Heath", frequency: "Every 10 min" },
  { number: "197", from: "Croydon", to: "Norwood Junction", frequency: "Every 12 min" },
  { number: "250", from: "Croydon Bus Station", to: "Beckenham", frequency: "Every 15 min" },
  { number: "312", from: "Croydon", to: "Addington Village", frequency: "Every 20 min" },
  { number: "407", from: "Croydon", to: "Sutton", frequency: "Every 15 min" },
  { number: "466", from: "Caterham", to: "Croydon", frequency: "Every 20 min" },
];

export default function Routes() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-24">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
        Our <span className="text-[#2dd4bf]">Routes</span>
      </h1>
      <p className="text-[#f0eaff]/50 text-lg mb-16">
        All routes currently operated by Todays Travel in Croydon Bus Simulator
      </p>

      <div className="flex flex-col gap-4">
        {routes.map((r) => (
          <div
            key={r.number}
            className="flex items-center gap-6 rounded-2xl border border-purple-900/40 bg-[#130d24] p-5 hover:border-[#8b3cf7]/60 transition-colors"
          >
            {/* Route number badge */}
            <div className="shrink-0 w-16 h-16 rounded-xl bg-[#8b3cf7] flex items-center justify-center">
              <span className="text-xl font-extrabold text-white">{r.number}</span>
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-bold text-[#f0eaff] truncate">
                {r.from}{" "}
                <span className="text-[#c084fc]">→</span>{" "}
                {r.to}
              </p>
              <p className="text-sm text-[#f0eaff]/40 mt-0.5">{r.frequency}</p>
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
