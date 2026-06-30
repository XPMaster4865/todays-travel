const staff = [
  {
    role: "Owner",
    colour: "#fbbf24",
    members: [{ name: "Lucas" }],
  },
  {
    role: "Co-Owner",
    colour: "#c084fc",
    members: [{ name: "Leo" }],
  },
  {
    role: "Moderator",
    colour: "#2dd4bf",
    members: [{ name: "Jack" }, { name: "XPMaster" }, { name: "Leo" }],
  },
  {
    role: "Media",
    colour: "#f472b6",
    members: [{ name: "Jack", badge: "Head" }, { name: "XPMaster" }, { name: "Callum" }],
  },
];

export default function Staff() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-24">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
        Our <span className="text-[#c084fc]">Staff</span>
      </h1>
      <p className="text-[#f0eaff]/50 text-lg mb-16">
        The team behind Todays Travel
      </p>

      <div className="flex flex-col gap-12">
        {staff.map((section) => (
          <div key={section.role}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 rounded-full" style={{ background: section.colour }} />
              <h2 className="text-xl font-bold" style={{ color: section.colour }}>
                {section.role}
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {section.members.map((member) => (
                <div
                  key={member.name + section.role}
                  className="flex items-center gap-4 rounded-2xl border border-purple-900/40 bg-[#130d24] p-5 hover:border-[#8b3cf7]/50 transition-colors"
                >
                  {/* Avatar */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-extrabold shrink-0"
                    style={{ background: `${section.colour}22`, color: section.colour, border: `2px solid ${section.colour}44` }}
                  >
                    {member.name[0].toUpperCase()}
                  </div>

                  <div>
                    <p className="font-bold text-[#f0eaff]">{member.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-[#f0eaff]/40">{section.role}</p>
                      {"badge" in member && member.badge && (
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: `${section.colour}22`, color: section.colour }}
                        >
                          {member.badge}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
