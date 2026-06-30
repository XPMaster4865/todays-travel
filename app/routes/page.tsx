const routes = [
  { number: "1", from: "Woodside Green", to: "Elmers End" },
  { number: "2", from: "High Street", to: "Selhurst Park" },
  { number: "3", from: "Manchester Beansgate", to: "South Croydon" },
  { number: "4", from: "Thornton Heath Parchmore Road", to: "Waddon Marsh" },
  { number: "5", from: "Woodside Green", to: "Thornton Heath Pond" },
  { number: "6", from: "Waddon Marsh", to: "West Croydon" },
  { number: "7", from: "Beddington", to: "Elmers End Superstore" },
  { number: "8", from: "Elmers End Superstore", to: "Woodside Green" },
  { number: "13", from: "Beddington Superstore", to: "Mitcham Common" },
  { number: "GR", from: "Manchester Beansgate", to: "South Coombe Road" },
  { number: "GR2", from: "West Croydon", to: "West Hogarth Crescent" },
  { number: "GR3", from: "Manchester Beansgate", to: "West Croydon" },
  { number: "GR4", from: "Mitcham Common", to: "Beddington Superstore" },
  { number: "GR5", from: "Selhurst Park", to: "Parchmore Road" },
  { number: "T1", from: "Croydon Hospital", to: "West Croydon" },
  { number: "T2", from: "Croydon Hospital", to: "West Croydon Bus Station" },
  { number: "T3", from: "Croydon Hospital", to: "East Croydon" },
  { number: "T4", from: "Croydon Hospital", to: "Mitcham Common" },
  { number: "T5", from: "Croydon Hospital", to: "Thornton Heath Parchmore Road" },
  { number: "T6", from: "Croydon Hospital", to: "Thornton Heath Parchmore Road" },
  { number: "T7", from: "Croydon Hospital", to: "Lombard Roundabout" },
  { number: "W17", from: "Lombard Roundabout", to: "Selhurst Park" },
  { number: "BS1", from: "Beddington Superstore", to: "Thornton Heath Pond" },
  { number: "P&R", from: "Selhurst Park", to: "Woodside Green" },
  { number: "TC1", from: "Town Centre", to: "South End" },
  { number: "🚌", from: "West Croydon", to: "South End" },
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
