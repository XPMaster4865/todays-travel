"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PortalTabs from "@/components/PortalTabs";

type Role = { label: string; colour: string };
type Session = { globalName: string; roles: Role[] };
type Entry = { id: string; balance: number; note: string; author: string; timestamp: number };

function formatCurrency(n: number) {
  return `${new Intl.NumberFormat("en-GB").format(n)} points`;
}

export default function Funds() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [balance, setBalance] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("tt_session");
    if (!stored) { router.replace("/portal"); return; }
    try {
      setSession(JSON.parse(stored));
    } catch { router.replace("/portal"); return; }
    setLoading(false);

    fetch("/api/funds/list")
      .then((res) => res.json())
      .then((data: { entries: Entry[] }) => setEntries(data.entries ?? []))
      .catch(() => setError("Could not load fund history."));
  }, [router]);

  const submit = async () => {
    const value = parseFloat(balance);
    if (!Number.isFinite(value)) { setError("Enter a valid number."); return; }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/funds/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ balance: value, note: note.trim(), author: session?.globalName }),
      });
      const data = await res.json() as { entry?: Entry; error?: string };
      if (data.entry) {
        setEntries((prev) => [data.entry!, ...prev]);
        setBalance("");
        setNote("");
      } else {
        setError(data.error ?? "Failed to log entry.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-2 border-[#8b3cf7] border-t-transparent animate-spin" />
      </div>
    );
  }

  const current = entries[0];

  return (
    <div className="max-w-2xl mx-auto px-4 py-24">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
        Company <span className="text-[#c084fc]">Funds</span>
      </h1>

      <PortalTabs />

      <div className="flex flex-col gap-6">
        {/* Current balance */}
        <div className="rounded-2xl border border-purple-900/40 bg-[#130d24] p-6">
          <h2 className="font-bold text-[#c084fc] mb-2">Current Balance</h2>
          {current ? (
            <>
              <p className="text-4xl font-extrabold text-[#2dd4bf]">{formatCurrency(current.balance)}</p>
              <p className="text-xs text-[#f0eaff]/40 mt-2">
                Logged by {current.author} · {new Date(current.timestamp).toLocaleString()}
              </p>
              {current.note && <p className="text-sm text-[#f0eaff]/60 mt-2">{current.note}</p>}
            </>
          ) : (
            <p className="text-[#f0eaff]/40 text-sm">No balance has been logged yet.</p>
          )}
        </div>

        {/* Log new entry */}
        <div className="rounded-2xl border border-purple-900/40 bg-[#130d24] p-6">
          <h2 className="font-bold text-lg mb-1 text-[#c084fc]">Log New Balance</h2>
          <p className="text-xs text-[#f0eaff]/40 mb-4">
            Record how much the company has right now.
          </p>
          <div className="flex flex-col gap-3">
            <input
              type="number"
              step="1"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              placeholder="Points (e.g. 1250)"
              className="bg-[#0f0a1e] border border-purple-900/40 rounded-xl px-4 py-2.5 text-sm text-[#f0eaff] placeholder-[#f0eaff]/20 focus:outline-none focus:border-[#8b3cf7]/60"
            />
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Note (optional)"
              className="bg-[#0f0a1e] border border-purple-900/40 rounded-xl px-4 py-2.5 text-sm text-[#f0eaff] placeholder-[#f0eaff]/20 focus:outline-none focus:border-[#8b3cf7]/60"
            />
            <button
              onClick={submit}
              disabled={submitting || !balance.trim()}
              className="px-5 py-2.5 rounded-xl bg-[#8b3cf7] hover:bg-[#7c3aed] disabled:opacity-40 text-white text-sm font-semibold transition-colors"
            >
              {submitting ? "Logging..." : "Log Balance"}
            </button>
            {error && <p className="text-sm text-red-400">{error}</p>}
          </div>
        </div>

        {/* History */}
        <div className="rounded-2xl border border-purple-900/40 bg-[#130d24] p-6">
          <h2 className="font-bold text-lg mb-4 text-[#c084fc]">History</h2>
          {entries.length === 0 ? (
            <p className="text-[#f0eaff]/40 text-sm">No entries yet.</p>
          ) : (
            <div className="flex flex-col gap-3 max-h-96 overflow-y-auto">
              {entries.map((e) => (
                <div key={e.id} className="flex items-center justify-between border border-purple-900/20 rounded-xl px-4 py-3">
                  <div>
                    <p className="font-semibold text-[#f0eaff]">{formatCurrency(e.balance)}</p>
                    {e.note && <p className="text-xs text-[#f0eaff]/50">{e.note}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#f0eaff]/40">{e.author}</p>
                    <p className="text-xs text-[#f0eaff]/30">{new Date(e.timestamp).toLocaleString()}</p>
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
