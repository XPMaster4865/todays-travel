"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PortalTabs from "@/components/PortalTabs";

const CLIENT_ID = "1521670583035629668";
const SCOPES = "identify guilds.members.read";

type Role = { label: string; colour: string };

type Session = {
  id: string;
  username: string;
  globalName: string;
  avatar: string | null;
  roles: Role[];
  inServer: boolean;
};

function loginUrl() {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: `${window.location.origin}/api/auth/callback`,
    response_type: "code",
    scope: SCOPES,
  });
  return `https://discord.com/oauth2/authorize?${params}`;
}

function PortalInner() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [codeStatus, setCodeStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [codeMessage, setCodeMessage] = useState("");
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const redeemCode = async () => {
    if (!code.trim()) return;
    setCodeStatus("loading");
    try {
      const res = await fetch("/api/auth/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });
      const data = await res.json() as { role?: Role; error?: string };
      if (data.role && session) {
        const already = session.roles.some((r) => r.label === data.role!.label);
        if (!already) {
          const updated = { ...session, roles: [...session.roles, data.role] };
          setSession(updated);
          sessionStorage.setItem("tt_session", JSON.stringify(updated));
        }
        setCodeStatus("success");
        setCodeMessage(`Role "${data.role.label}" added!`);
        setCode("");
      } else {
        setCodeStatus("error");
        setCodeMessage("Invalid code. Please check and try again.");
      }
    } catch {
      setCodeStatus("error");
      setCodeMessage("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      try {
        const decoded = JSON.parse(decodeURIComponent(atob(hash)));
        setSession(decoded);
        sessionStorage.setItem("tt_session", JSON.stringify(decoded));
        window.history.replaceState(null, "", window.location.pathname);
      } catch { /* ignore */ }
    } else {
      const stored = sessionStorage.getItem("tt_session");
      if (stored) {
        try { setSession(JSON.parse(stored)); } catch { /* ignore */ }
      }
    }
    setLoading(false);
  }, []);

  const logout = () => {
    sessionStorage.removeItem("tt_session");
    setSession(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-2 border-[#8b3cf7] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-24">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
        Staff <span className="text-[#c084fc]">Portal</span>
      </h1>

      {session && <PortalTabs />}

      {!session ? (
        <div className="rounded-2xl border border-purple-900/40 bg-[#130d24] p-10 flex flex-col items-center text-center gap-6 mt-10">
          <div className="w-16 h-16 rounded-full bg-[#5865F2]/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-[#5865F2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">Sign in with Discord</h2>
            <p className="text-[#f0eaff]/50 text-sm">
              Your roles are automatically detected from the Todays Travel Discord server.
            </p>
          </div>
          {error && (
            <p className="text-red-400 text-sm bg-red-900/20 border border-red-700/30 px-4 py-2 rounded-lg">
              {error === "no_code" && "Authentication was cancelled."}
              {error === "token_failed" && "Failed to authenticate. Please try again."}
              {error === "server_error" && "A server error occurred. Please try again."}
            </p>
          )}
          <a
            href={loginUrl()}
            className="flex items-center gap-3 px-6 py-3 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
            </svg>
            Login with Discord
          </a>
        </div>
      ) : (
        <div className="flex flex-col gap-6 mt-10">
          {/* Profile */}
          <div className="rounded-2xl border border-purple-900/40 bg-[#130d24] p-6 flex items-center gap-5">
            <img
              src={session.avatar ?? "https://cdn.discordapp.com/embed/avatars/0.png"}
              alt={session.globalName}
              className="w-16 h-16 rounded-full border-2 border-purple-900/40"
            />
            <div>
              <p className="text-xl font-bold text-[#f0eaff]">{session.globalName}</p>
              <p className="text-sm text-[#f0eaff]/40">@{session.username}</p>
            </div>
            <button onClick={logout} className="ml-auto text-xs text-[#f0eaff]/30 hover:text-red-400 transition-colors">
              Sign out
            </button>
          </div>

          {/* Roles */}
          <div className="rounded-2xl border border-purple-900/40 bg-[#130d24] p-6">
            <h2 className="font-bold text-lg mb-4 text-[#c084fc]">Your Roles</h2>
            {!session.inServer ? (
              <p className="text-[#f0eaff]/40 text-sm">
                You&apos;re not in the Todays Travel Discord server. Join first, then sign in again.
              </p>
            ) : session.roles.length === 0 ? (
              <p className="text-[#f0eaff]/40 text-sm">
                You&apos;re in the server but don&apos;t have any staff roles assigned yet.
              </p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {session.roles.map((role) => (
                  <span
                    key={role.label}
                    className="px-4 py-2 rounded-xl text-sm font-semibold border"
                    style={{ color: role.colour, borderColor: `${role.colour}44`, background: `${role.colour}18` }}
                  >
                    {role.label}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Role code */}
          <div className="rounded-2xl border border-purple-900/40 bg-[#130d24] p-6">
            <h2 className="font-bold text-lg mb-1 text-[#c084fc]">Role Code</h2>
            <p className="text-xs text-[#f0eaff]/40 mb-4">
              If your roles weren&apos;t detected correctly, enter a code below to manually add them.
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                value={code}
                onChange={(e) => { setCode(e.target.value.toUpperCase()); setCodeStatus("idle"); }}
                onKeyDown={(e) => e.key === "Enter" && redeemCode()}
                placeholder="Enter code..."
                className="flex-1 bg-[#0f0a1e] border border-purple-900/40 rounded-xl px-4 py-2.5 text-sm text-[#f0eaff] placeholder-[#f0eaff]/20 focus:outline-none focus:border-[#8b3cf7]/60"
              />
              <button
                onClick={redeemCode}
                disabled={codeStatus === "loading" || !code.trim()}
                className="px-5 py-2.5 rounded-xl bg-[#8b3cf7] hover:bg-[#7c3aed] disabled:opacity-40 text-white text-sm font-semibold transition-colors"
              >
                {codeStatus === "loading" ? "..." : "Redeem"}
              </button>
            </div>
            {codeStatus === "success" && (
              <p className="mt-3 text-sm text-emerald-400">{codeMessage}</p>
            )}
            {codeStatus === "error" && (
              <p className="mt-3 text-sm text-red-400">{codeMessage}</p>
            )}
          </div>

          {/* Quick links */}
          <div className="rounded-2xl border border-purple-900/40 bg-[#130d24] p-6">
            <h2 className="font-bold text-lg mb-4 text-[#c084fc]">Quick Links</h2>
            <div className="flex flex-wrap gap-3">
              <a href="https://discord.gg/zubDeVEUt6" target="_blank" rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#5865F2]/20 border border-[#5865F2]/30 text-[#5865F2] hover:bg-[#5865F2]/30 transition-colors">
                Discord Server
              </a>
              <a href="/fleet" className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#8b3cf7]/20 border border-[#8b3cf7]/30 text-[#c084fc] hover:bg-[#8b3cf7]/30 transition-colors">
                Fleet
              </a>
              <a href="/routes" className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#2dd4bf]/10 border border-[#2dd4bf]/30 text-[#2dd4bf] hover:bg-[#2dd4bf]/20 transition-colors">
                Routes
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Portal() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-2 border-[#8b3cf7] border-t-transparent animate-spin" />
      </div>
    }>
      <PortalInner />
    </Suspense>
  );
}
