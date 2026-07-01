const staff = [
  {
    name: "Lucas",
    username: "@luketaylor0378",
    id: "1238906611045634058",
    roles: ["Owner"],
  },
  {
    name: "Leo",
    username: "@leo20215022",
    id: "800072537924304927",
    roles: ["Co-Owner", "Moderator"],
  },
  {
    name: "Jack",
    username: "@ducklover200._36574",
    id: "1468280480276156669",
    roles: ["Moderator", "Head of Media"],
  },
  {
    name: "XPMaster",
    username: "@xpmaster4865",
    id: "1441881068478267492",
    roles: ["Moderator", "Media"],
  },
  {
    name: "Callum",
    username: "@callum_ptfs",
    id: "1424028978016161883",
    roles: ["Media"],
  },
];

const roleColour: Record<string, string> = {
  "Owner": "#fbbf24",
  "Co-Owner": "#c084fc",
  "Moderator": "#2dd4bf",
  "Head of Media": "#f472b6",
  "Media": "#f472b6",
};

export default function Staff() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-24">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
        Our <span className="text-[#c084fc]">Staff</span>
      </h1>
      <p className="text-[#f0eaff]/50 text-lg mb-16">The team behind Todays Travel</p>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {staff.map((person) => (
          <div
            key={person.username}
            className="flex flex-col items-center text-center rounded-2xl border border-purple-900/40 bg-[#130d24] p-6 hover:border-[#8b3cf7]/60 transition-colors"
          >
            <img
              src={`/api/staff/avatar?id=${person.id}`}
              alt={person.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-purple-900/40 mb-4"
            />
            <p className="text-lg font-bold text-[#f0eaff]">{person.name}</p>
            <a
              href={`https://discord.com/users/${person.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#f0eaff]/40 hover:text-[#c084fc] transition-colors mb-4"
            >
              {person.username}
            </a>
            <div className="flex flex-wrap gap-2 justify-center">
              {person.roles.map((role) => (
                <span
                  key={role}
                  className="text-xs font-semibold px-3 py-1 rounded-full border"
                  style={{
                    color: roleColour[role] ?? "#f0eaff",
                    borderColor: `${roleColour[role] ?? "#f0eaff"}44`,
                    background: `${roleColour[role] ?? "#f0eaff"}11`,
                  }}
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
