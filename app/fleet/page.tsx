const fleet = [
  {
    id: "TT001",
    type: "Alexander Dennis Enviro400",
    livery: "Standard Purple",
    liveryColours: ["#8b3cf7", "#c084fc"],
    status: "In Service",
  },
  {
    id: "TT002",
    type: "Alexander Dennis Enviro400",
    livery: "Standard Purple",
    liveryColours: ["#8b3cf7", "#c084fc"],
    status: "In Service",
  },
  {
    id: "TT003",
    type: "Alexander Dennis Enviro400",
    livery: "Silver Edition",
    liveryColours: ["#9ca3af", "#6b7280"],
    status: "In Service",
  },
  {
    id: "TT004",
    type: "Alexander Dennis Enviro400",
    livery: "Purple & Teal",
    liveryColours: ["#8b3cf7", "#2dd4bf"],
    status: "In Service",
  },
  {
    id: "TT005",
    type: "Alexander Dennis Enviro400",
    livery: "Silver Edition",
    liveryColours: ["#9ca3af", "#6b7280"],
    status: "Not In Service",
  },
];

export default function Fleet() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-24">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
        Our <span className="text-[#c084fc]">Fleet</span>
      </h1>
      <p className="text-[#f0eaff]/50 text-lg mb-16">
        All vehicles currently operated by Todays Travel
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {fleet.map((bus) => (
          <div
            key={bus.id}
            className="rounded-2xl border border-purple-900/40 bg-[#130d24] p-6 hover:border-[#8b3cf7]/60 transition-colors"
          >
            {/* Livery stripe */}
            <div className="flex gap-1 mb-4">
              {bus.liveryColours.map((c, i) => (
                <div key={i} className="h-2 flex-1 rounded-full" style={{ background: c }} />
              ))}
            </div>

            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs text-[#f0eaff]/40 mb-0.5">Fleet number</p>
                <p className="text-2xl font-extrabold text-[#c084fc]">{bus.id}</p>
              </div>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  bus.status === "In Service"
                    ? "bg-emerald-900/40 text-emerald-400 border border-emerald-700/40"
                    : "bg-red-900/30 text-red-400 border border-red-700/30"
                }`}
              >
                {bus.status}
              </span>
            </div>

            <p className="text-sm text-[#f0eaff]/70 mb-1">{bus.type}</p>
            <p className="text-xs text-[#2dd4bf]/70">{bus.livery} livery</p>
          </div>
        ))}
      </div>
    </div>
  );
}
