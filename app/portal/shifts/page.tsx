"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PortalTabs from "@/components/PortalTabs";

type Role = { label: string; colour: string };
type Session = { id: string; globalName: string; roles: Role[] };
type ActiveShift = { startedAt: number; author: string };
type ShiftEntry = { id: string; userId: string; author: string; startedAt: number; endedAt: number };

function formatDuration(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours === 0) return `${minutes}m ${seconds}s`;
  return `${hours}h ${minutes}m ${seconds}s`;
}

export default function Shifts() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<ShiftEntry[]>([]);
  const [active, setActive] = useState<Record<string, ActiveShift>>({});
  const [now, setNow] = useState(Date.now());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = (userId: string) => {
    fetch(`/api/shifts/list?userId=${encodeURIComponent(userId)}`)
      .then((res) => res.json())
      .then((data: { entries: ShiftEntry[]; active: Record<string, ActiveShift> }) => {
        setEntries(data.entries ?? []);
        setActive(data.active ?? {});
      })
      .catch(() => setError("Could not load shift data."));
  };

  useEffect(() => {
    const stored = sessionStorage.getItem("tt_session");
    if (!stored) { router.replace("/portal"); return; }
    let parsed: Session;
    try {
      parsed = JSON.parse(stored);
      setSession(parsed);
    } catch { router.replace("/portal"); return; }
    setLoading(false);
    load(parsed.id);
  }, [router]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const myShift = session ? active[session.id] : undefined;

  const clockIn = async () => {
    if (!session) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/shifts/clock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.id, author: session.globalName, action: "start" }),
      });
      const data = await res.json() as { active?: ActiveShift; error?: string };
      if (data.active) {
        setActive((prev) => ({ ...prev, [session.id]: data.active! }));
      } else {
        setError(data.error ?? "Failed to start shift.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const clockOut = async () => {
    if (!session) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/shifts/clock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.id, author: session.globalName, action: "end" }),
      });
      const data = await res.json() as { entry?: ShiftEntry; error?: string };
      if (data.entry) {
        setEntries((prev) => [data.entry!, ...prev]);
        setActive((prev) => {
          const next = { ...prev };
          delete next[session.id];
          return next;
        });
      } else {
        setError(data.error ?? "Failed to end shift.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-2 border-[#8b3cf7] border-t-transparent animate-spin" />
      </div>
    );
  }

  const myEntries = entries.filter((e) => e.userId === session?.id);

  return (
    <div className="max-w-2xl mx-auto px-4 py-24">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
        <span className="text-[#c084fc]">Shifts</span>
      </h1>

      <PortalTabs />

      <div className="flex flex-col gap-6">
        {/* Clock in/out */}
        <div className="rounded-2xl border border-purple-900/40 bg-[#130d24] p-6">
          <h2 className="font-bold text-[#c084fc] mb-2">Your Shift</h2>
          {myShift ? (
            <>
              <p className="text-3xl font-extrabold text-[#2dd4bf]">{formatDuration(now - myShift.startedAt)}</p>
              <p className="text-xs text-[#f0eaff]/40 mt-2">
                Started {new Date(myShift.startedAt).toLocaleTimeString()}
              </p>
              <button
                onClick={clockOut}
                disabled={busy}
                className="mt-4 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white text-sm font-semibold transition-colors"
              >
                {busy ? "..." : "Clock Out"}
              </button>
            </>
          ) : (
            <>
              <p className="text-[#f0eaff]/40 text-sm mb-4">You&apos;re not currently clocked in.</p>
              <button
                onClick={clockIn}
                disabled={busy}
                className="px-5 py-2.5 rounded-xl bg-[#8b3cf7] hover:bg-[#7c3aed] disabled:opacity-40 text-white text-sm font-semibold transition-colors"
              >
                {busy ? "..." : "Clock In"}
              </button>
            </>
          )}
          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        </div>

        {/* History */}
        <div className="rounded-2xl border border-purple-900/40 bg-[#130d24] p-6">
          <h2 className="font-bold text-lg mb-4 text-[#c084fc]">Your Shift History</h2>
          {myEntries.length === 0 ? (
            <p className="text-[#f0eaff]/40 text-sm">No completed shifts yet.</p>
          ) : (
            <div className="flex flex-col gap-3 max-h-96 overflow-y-auto">
              {myEntries.map((e) => (
                <div key={e.id} className="flex items-center justify-between border border-purple-900/20 rounded-xl px-4 py-3">
                  <div>
                    <p className="font-semibold text-[#f0eaff]">{e.author}</p>
                    <p className="text-xs text-[#f0eaff]/50">{formatDuration(e.endedAt - e.startedAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#f0eaff]/40">{new Date(e.startedAt).toLocaleString()}</p>
                    <p className="text-xs text-[#f0eaff]/30">to {new Date(e.endedAt).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
