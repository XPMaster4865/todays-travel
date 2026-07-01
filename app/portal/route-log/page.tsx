"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import PortalTabs from "@/components/PortalTabs";

type Role = { label: string; colour: string };
type Session = { globalName: string; roles: Role[] };
type Entry = { id: string; route: string; note: string; author: string; timestamp: number; imageKey: string };

const ADMIN_ROLES = ["Owner", "Co-Owner", "Moderator", "Builder"];

const ROUTE_NUMBERS = [
  "1", "2", "3", "4", "5", "6", "7", "8", "13",
  "GR", "GR2", "GR3", "GR4", "GR5",
  "T1", "T2", "T3", "T4", "T5", "T6", "T7",
  "W17", "BS1", "P&R", "TC1", "🚌",
  "50", "60", "64", "75", "109", "119", "130", "157", "166", "194",
  "197", "198", "250", "264", "289", "312", "367", "403", "405", "407",
  "412", "433", "450", "455", "466", "468", "S4", "N68", "N250",
  "TR1", "TR2", "TR3", "RR1", "RR2", "RR3", "RR4", "SCS",
];

export default function RouteLog() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [route, setRoute] = useState(ROUTE_NUMBERS[0]);
  const [note, setNote] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("tt_session");
    if (!stored) { router.replace("/portal"); return; }
    try {
      setSession(JSON.parse(stored));
    } catch { router.replace("/portal"); return; }
    setLoading(false);

    fetch("/api/routelog/list")
      .then((res) => res.json())
      .then((data: { entries: Entry[] }) => setEntries(data.entries ?? []))
      .catch(() => setError("Could not load route log history."));
  }, [router]);

  const isAdmin = session?.roles.some((r) => ADMIN_ROLES.includes(r.label)) ?? false;

  const deleteEntry = async (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    try {
      await fetch("/api/routelog/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch { /* ignore */ }
  };

  const onFileChange = (file: File | null) => {
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const submit = async () => {
    if (!image) {
      setError("Please upload a screenshot of the finish screen.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const form = new FormData();
      form.append("route", route);
      form.append("note", note.trim());
      form.append("author", session?.globalName ?? "Unknown");
      form.append("image", image);

      const res = await fetch("/api/routelog/add", { method: "POST", body: form });
      const data = await res.json() as { entry?: Entry; error?: string; detail?: string };
      if (data.entry) {
        setEntries((prev) => [data.entry!, ...prev]);
        setNote("");
        onFileChange(null);
        if (fileRef.current) fileRef.current.value = "";
      } else {
        setError(`${data.error ?? "Failed to log route."}${data.detail ? ` (${data.detail})` : ""}`);
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

  const myEntries = entries.filter((e) => e.author === session?.globalName);

  return (
    <div className="max-w-2xl mx-auto px-4 py-24">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
        Route <span className="text-[#c084fc]">Log</span>
      </h1>

      <PortalTabs />

      <div className="flex flex-col gap-6">
        {/* Log a route */}
        <div className="rounded-2xl border border-purple-900/40 bg-[#130d24] p-6">
          <h2 className="font-bold text-lg mb-1 text-[#c084fc]">Log a Completed Route</h2>
          <p className="text-xs text-[#f0eaff]/40 mb-4">
            Record a route you&apos;ve just driven. A screenshot of the finish screen is required.
          </p>
          <div className="flex flex-col gap-3">
            <select
              value={route}
              onChange={(e) => setRoute(e.target.value)}
              className="bg-[#0f0a1e] border border-purple-900/40 rounded-xl px-4 py-2.5 text-sm text-[#f0eaff] focus:outline-none focus:border-[#8b3cf7]/60"
            >
              {ROUTE_NUMBERS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Note (optional)"
              className="bg-[#0f0a1e] border border-purple-900/40 rounded-xl px-4 py-2.5 text-sm text-[#f0eaff] placeholder-[#f0eaff]/20 focus:outline-none focus:border-[#8b3cf7]/60"
            />

            <div>
              <label className="block text-xs text-[#f0eaff]/40 mb-2">Finish screen screenshot</label>
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-[#f0eaff]/70 file:mr-4 file:px-4 file:py-2 file:rounded-xl file:border-0 file:bg-[#8b3cf7] file:text-white file:font-semibold file:cursor-pointer hover:file:bg-[#7c3aed]"
              />
              {preview && (
                <img src={preview} alt="Preview" className="mt-3 rounded-xl border border-purple-900/40 max-h-48" />
              )}
            </div>

            <button
              onClick={submit}
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-[#8b3cf7] hover:bg-[#7c3aed] disabled:opacity-40 text-white text-sm font-semibold transition-colors"
            >
              {submitting ? "Logging..." : "Log Route"}
            </button>
            {error && <p className="text-sm text-red-400">{error}</p>}
          </div>
        </div>

        {/* My stats */}
        <div className="rounded-2xl border border-purple-900/40 bg-[#130d24] p-6">
          <h2 className="font-bold text-[#c084fc] mb-2">Your Routes Logged</h2>
          <p className="text-4xl font-extrabold text-[#2dd4bf]">{myEntries.length}</p>
        </div>

        {/* History */}
        <div className="rounded-2xl border border-purple-900/40 bg-[#130d24] p-6">
          <h2 className="font-bold text-lg mb-4 text-[#c084fc]">Recent Routes</h2>
          {entries.length === 0 ? (
            <p className="text-[#f0eaff]/40 text-sm">No routes logged yet.</p>
          ) : (
            <div className="flex flex-col gap-3 max-h-[32rem] overflow-y-auto">
              {entries.map((e) => (
                <div key={e.id} className="flex items-center gap-3 border border-purple-900/20 rounded-xl px-4 py-3">
                  <img
                    src={`/api/routelog/image?key=${encodeURIComponent(e.imageKey)}`}
                    alt={`Route ${e.route} finish screen`}
                    className="shrink-0 w-16 h-16 rounded-lg object-cover border border-purple-900/40"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="shrink-0 px-2 py-0.5 rounded bg-[#8b3cf7] text-xs font-extrabold text-white">{e.route}</span>
                      <p className="font-semibold text-[#f0eaff] truncate">{e.author}</p>
                    </div>
                    {e.note && <p className="text-xs text-[#f0eaff]/50 mt-1">{e.note}</p>}
                  </div>
                  <div className="shrink-0 text-right flex flex-col items-end gap-1">
                    <p className="text-xs text-[#f0eaff]/30">{new Date(e.timestamp).toLocaleString()}</p>
                    {isAdmin && (
                      <button
                        onClick={() => deleteEntry(e.id)}
                        className="text-xs text-red-400/70 hover:text-red-400 transition-colors"
                        aria-label="Delete entry"
                      >
                        Delete
                      </button>
                    )}
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
