"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import PortalTabs from "@/components/PortalTabs";

type Role = { label: string; colour: string };
type Session = { globalName: string; roles: Role[] };
type State = { route: string; weekStart: number; championName: string; championCount: number; posterKey?: string };

const ALLOWED_ROLES = ["Owner", "Builder"];

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

export default function DotwManage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<State | null>(null);
  const [route, setRoute] = useState(ROUTE_NUMBERS[0]);
  const [championName, setChampionName] = useState("");
  const [championCount, setChampionCount] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [posterBusy, setPosterBusy] = useState(false);
  const [posterError, setPosterError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

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

    fetch("/api/dotw/state")
      .then((res) => res.json())
      .then((data: { state: State }) => {
        setState(data.state);
        if (data.state.route) setRoute(data.state.route);
        setChampionName(data.state.championName);
        setChampionCount(String(data.state.championCount));
      })
      .finally(() => setLoading(false));
  }, [router]);

  const update = async (body: Record<string, unknown>) => {
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch("/api/dotw/set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json() as { state?: State; error?: string };
      if (data.state) {
        setState(data.state);
        setMessage("Updated.");
      } else {
        setMessage(data.error ?? "Failed to update.");
      }
    } catch {
      setMessage("Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const onPosterChange = (file: File | null) => {
    setPosterFile(file);
    setPosterPreview(file ? URL.createObjectURL(file) : null);
  };

  const uploadPoster = async () => {
    if (!posterFile) return;
    setPosterBusy(true);
    setPosterError("");
    try {
      const form = new FormData();
      form.append("image", posterFile);
      const res = await fetch("/api/dotw/poster", { method: "POST", body: form });
      const data = await res.json() as { state?: State; error?: string; detail?: string };
      if (data.state) {
        setState(data.state);
        setPosterFile(null);
        setPosterPreview(null);
        if (fileRef.current) fileRef.current.value = "";
      } else {
        setPosterError(`${data.error ?? "Failed to upload poster."}${data.detail ? ` (${data.detail})` : ""}`);
      }
    } catch {
      setPosterError("Something went wrong. Please try again.");
    } finally {
      setPosterBusy(false);
    }
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
        Manage <span className="text-[#fbbf24]">Driver of the Week</span>
      </h1>

      <PortalTabs />

      <div className="flex flex-col gap-6">
        {/* Set weekly route */}
        <div className="rounded-2xl border border-purple-900/40 bg-[#130d24] p-6">
          <h2 className="font-bold text-lg mb-1 text-[#c084fc]">This Week&apos;s Route</h2>
          <p className="text-xs text-[#f0eaff]/40 mb-4">
            Currently set to: <span className="text-[#2dd4bf] font-semibold">{state?.route || "None"}</span>
          </p>
          <div className="flex gap-3">
            <select
              value={route}
              onChange={(e) => setRoute(e.target.value)}
              className="flex-1 bg-[#0f0a1e] border border-purple-900/40 rounded-xl px-4 py-2.5 text-sm text-[#f0eaff] focus:outline-none focus:border-[#8b3cf7]/60"
            >
              {ROUTE_NUMBERS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <button
              onClick={() => update({ route })}
              disabled={busy}
              className="px-5 py-2.5 rounded-xl bg-[#8b3cf7] hover:bg-[#7c3aed] disabled:opacity-40 text-white text-sm font-semibold transition-colors"
            >
              Set Route
            </button>
          </div>

          {/* Optional route poster */}
          <div className="mt-5 pt-5 border-t border-purple-900/20">
            <label className="block text-xs text-[#f0eaff]/40 mb-2">Route poster (optional)</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => onPosterChange(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-[#f0eaff]/70 file:mr-4 file:px-4 file:py-2 file:rounded-xl file:border-0 file:bg-[#8b3cf7] file:text-white file:font-semibold file:cursor-pointer hover:file:bg-[#7c3aed]"
            />
            {(posterPreview || state?.posterKey) && (
              <img
                src={posterPreview ?? `/api/dotw/image?key=${encodeURIComponent(state!.posterKey!)}`}
                alt="Route poster"
                className="mt-3 rounded-xl border border-purple-900/40 max-h-48"
              />
            )}
            {posterFile && (
              <button
                onClick={uploadPoster}
                disabled={posterBusy}
                className="mt-3 px-5 py-2.5 rounded-xl bg-[#8b3cf7] hover:bg-[#7c3aed] disabled:opacity-40 text-white text-sm font-semibold transition-colors"
              >
                {posterBusy ? "Uploading..." : "Upload Poster"}
              </button>
            )}
            {posterError && <p className="mt-3 text-sm text-red-400">{posterError}</p>}
          </div>
        </div>

        {/* Reset week */}
        <div className="rounded-2xl border border-purple-900/40 bg-[#130d24] p-6">
          <h2 className="font-bold text-lg mb-1 text-[#c084fc]">Start New Week</h2>
          <p className="text-xs text-[#f0eaff]/40 mb-4">
            Resets the leaderboard tracking window to start counting from now. Do this when starting a new competition week.
          </p>
          <button
            onClick={() => update({ resetWeek: true })}
            disabled={busy}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white text-sm font-semibold transition-colors"
          >
            Reset Week
          </button>
        </div>

        {/* Set champion */}
        <div className="rounded-2xl border border-[#fbbf24]/40 bg-[#130d24] p-6">
          <h2 className="font-bold text-lg mb-1 text-[#fbbf24]">Current Driver of the Week</h2>
          <p className="text-xs text-[#f0eaff]/40 mb-4">
            Set this once the winner has been given the Driver of the Week role in Discord.
          </p>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={championName}
              onChange={(e) => setChampionName(e.target.value)}
              placeholder="Champion's name"
              className="bg-[#0f0a1e] border border-purple-900/40 rounded-xl px-4 py-2.5 text-sm text-[#f0eaff] placeholder-[#f0eaff]/20 focus:outline-none focus:border-[#8b3cf7]/60"
            />
            <input
              type="number"
              value={championCount}
              onChange={(e) => setChampionCount(e.target.value)}
              placeholder="Routes driven"
              className="bg-[#0f0a1e] border border-purple-900/40 rounded-xl px-4 py-2.5 text-sm text-[#f0eaff] placeholder-[#f0eaff]/20 focus:outline-none focus:border-[#8b3cf7]/60"
            />
            <button
              onClick={() => update({ championName, championCount: parseInt(championCount, 10) || 0 })}
              disabled={busy}
              className="px-5 py-2.5 rounded-xl bg-[#fbbf24] hover:bg-[#f59e0b] disabled:opacity-40 text-black text-sm font-semibold transition-colors"
            >
              Crown Champion
            </button>
          </div>
        </div>

        {message && <p className="text-sm text-[#2dd4bf]">{message}</p>}

        <a
          href="/driver-of-the-week"
          target="_blank"
          rel="noopener noreferrer"
          className="text-center text-sm text-[#c084fc] hover:underline"
        >
          View public Driver of the Week page →
        </a>
      </div>
    </div>
  );
}
