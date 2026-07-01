"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PortalTabs from "@/components/PortalTabs";

type Role = { label: string; colour: string };
type Session = { roles: Role[] };
type Member = {
  id: string;
  username: string;
  globalName: string;
  avatar: string | null;
  roles: Role[];
  inServer: boolean;
  lastLogin: number;
};

const ALLOWED_ROLES = ["Owner", "Builder"];

export default function Members() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("tt_session");
    if (!stored) { router.replace("/portal"); return; }
    try {
      const session = JSON.parse(stored) as Session;
      if (!session.roles.some((r) => ALLOWED_ROLES.includes(r.label))) {
        router.replace("/portal");
        return;
      }
    } catch { router.replace("/portal"); return; }

    fetch("/api/members/list")
      .then((res) => res.json())
      .then((data: { members: Member[] }) => {
        setMembers((data.members ?? []).sort((a, b) => b.lastLogin - a.lastLogin));
      })
      .catch(() => setError("Could not load members."))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-2 border-[#8b3cf7] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-24">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
        Portal <span className="text-[#c084fc]">Members</span>
      </h1>
      <p className="text-[#f0eaff]/50 text-lg mb-10">
        Everyone who has signed into the staff portal.
      </p>

      <PortalTabs />

      <div className="rounded-2xl border border-purple-900/40 bg-[#130d24] p-6">
        {error && <p className="text-sm text-red-400 mb-4">{error}</p>}
        {members.length === 0 ? (
          <p className="text-[#f0eaff]/40 text-sm">No one has signed in yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {members.map((m) => (
              <div key={m.id} className="flex items-center gap-4 border border-purple-900/20 rounded-xl px-4 py-3">
                <img
                  src={m.avatar ?? "https://cdn.discordapp.com/embed/avatars/0.png"}
                  alt={m.globalName}
                  className="w-12 h-12 rounded-full object-cover border border-purple-900/40"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-[#f0eaff] truncate">{m.globalName}</p>
                    {!m.inServer && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-900/30 border border-red-700/40 text-red-400">
                        Left server
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#f0eaff]/40">@{m.username}</p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {m.roles.length === 0 ? (
                      <span className="text-xs text-[#f0eaff]/30">No roles</span>
                    ) : (
                      m.roles.map((role) => (
                        <span
                          key={role.label}
                          className="text-xs font-semibold px-2 py-0.5 rounded-full border"
                          style={{ color: role.colour, borderColor: `${role.colour}44`, background: `${role.colour}18` }}
                        >
                          {role.label}
                        </span>
                      ))
                    )}
                  </div>
                </div>
                <p className="shrink-0 text-xs text-[#f0eaff]/30 text-right">
                  Last login<br />{new Date(m.lastLogin).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
