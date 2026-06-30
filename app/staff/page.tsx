import fs from "fs";
import path from "path";

const staff = [
  {
    name: "Lucas",
    username: "@luketaylor0378",
    avatar: "lucas",
    roles: ["Owner"],
  },
  {
    name: "Leo",
    username: "@leo20215022",
    avatar: "leo",
    roles: ["Co-Owner", "Moderator"],
  },
  {
    name: "Jack",
    username: "@ducklover200._36574",
    avatar: "jack",
    roles: ["Moderator", "Head of Media"],
  },
  {
    name: "XPMaster",
    username: "@xpmaster4865",
    avatar: "xpmaster",
    roles: ["Moderator", "Media"],
  },
  {
    name: "Callum",
    username: "@callum_ptfs",
    avatar: "callum",
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

function avatarUrl(key: string, name: string, staffDir: string): string {
  const exts = ["png", "jpg", "jpeg", "webp"];
  for (const ext of exts) {
    if (fs.existsSync(path.join(staffDir, `${key}.${ext}`))) {
      return `/staff/${key}.${ext}`;
    }
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=8b3cf7&color=fff&size=128&bold=true`;
}

export default function Staff() {
  const staffDir = path.join(process.cwd(), "public", "staff");

  return (
    <div className="max-w-5xl mx-auto px-4 py-24">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
        Our <span className="text-[#c084fc]">Staff</span>
      </h1>
      <p className="text-[#f0eaff]/50 text-lg mb-16">The team behind Todays Travel</p>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {staff.map((person) => {
          const avatar = avatarUrl(person.avatar, person.name, staffDir);
          return (
            <div
              key={person.username}
              className="flex flex-col items-center text-center rounded-2xl border border-purple-900/40 bg-[#130d24] p-6 hover:border-[#8b3cf7]/60 transition-colors"
            >
              {/* Avatar */}
              <img
                src={avatar}
                alt={person.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-purple-900/40 mb-4"
              />

              {/* Name & username */}
              <p className="text-lg font-bold text-[#f0eaff]">{person.name}</p>
              <p className="text-sm text-[#f0eaff]/40 mb-4">{person.username}</p>

              {/* Roles */}
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
          );
        })}
      </div>

      <p className="text-center text-[#f0eaff]/20 text-xs mt-16">
        To update profile pictures, add an image named after each person to <code>public/staff/</code>
      </p>
    </div>
  );
}
