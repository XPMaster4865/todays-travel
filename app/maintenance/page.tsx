"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PortalTabs from "@/components/PortalTabs";

type Role = { label: string; colour: string };
type Session = { globalName: string; avatar: string | null; roles: Role[] };

type PingResult = { page: string; url: string; status: "ok" | "error" | "pending"; ms: number | null };
type ErrorEntry = { message: string; source: string; time: string };
type PerfData = {
  dns: number; tcp: number; ttfb: number; load: number; domReady: number;
};

function fmt(ms: number | null) {
  if (ms === null) return "—";
  return ms < 1000 ? `${Math.round(ms)}ms` : `${(ms / 1000).toFixed(2)}s`;
}

function StatusDot({ status }: { status: "ok" | "error" | "pending" }) {
  return (
    <span className={`inline-block w-2 h-2 rounded-full ${
      status === "ok" ? "bg-emerald-400" : status === "error" ? "bg-red-400" : "bg-amber-400 animate-pulse"
    }`} />
  );
}

export default function Maintenance() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [pings, setPings] = useState<PingResult[]>([]);
  const [errors, setErrors] = useState<ErrorEntry[]>([]);
  const [perf, setPerf] = useState<PerfData | null>(null);
  const [memory, setMemory] = useState<{ used: number; total: number } | null>(null);
  const [connection, setConnection] = useState<string>("Unknown");

  useEffect(() => {
    // Auth check
    const stored = sessionStorage.getItem("tt_session");
    if (!stored) { router.replace("/portal"); return; }
    try {
      const session: Session = JSON.parse(stored);
      if (!session.roles.some((r) => r.label === "Builder")) {
        router.replace("/portal");
        return;
      }
    } catch { router.replace("/portal"); return; }
    setReady(true);

    // Catch JS errors
    const handler = (event: ErrorEvent) => {
      setErrors((prev) => [
        { message: event.message, source: event.filename?.split("/").pop() ?? "unknown", time: new Date().toLocaleTimeString() },
        ...prev.slice(0, 19),
      ]);
    };
    window.addEventListener("error", handler);

    // Performance metrics
    const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (navEntry) {
      setPerf({
        dns: navEntry.domainLookupEnd - navEntry.domainLookupStart,
        tcp: navEntry.connectEnd - navEntry.connectStart,
        ttfb: navEntry.responseStart - navEntry.requestStart,
        load: navEntry.loadEventEnd - navEntry.startTime,
        domReady: navEntry.domContentLoadedEventEnd - navEntry.startTime,
      });
    }

    // Memory (Chrome only)
    const mem = (performance as unknown as { memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
    if (mem) {
      setMemory({ used: Math.round(mem.usedJSHeapSize / 1048576), total: Math.round(mem.jsHeapSizeLimit / 1048576) });
    }

    // Connection info
    const conn = (navigator as unknown as { connection?: { effectiveType?: string; downlink?: number } }).connection;
    if (conn) setConnection(`${conn.effectiveType ?? "?"} (${conn.downlink ?? "?"}Mbps)`);

    // Ping key pages
    const pages: Omit<PingResult, "status" | "ms">[] = [
      { page: "Home", url: "/" },
      { page: "Fleet", url: "/fleet" },
      { page: "Routes", url: "/routes" },
      { page: "Staff", url: "/staff" },
      { page: "Gallery", url: "/gallery" },
      { page: "Portal", url: "/portal" },
    ];

    setPings(pages.map((p) => ({ ...p, status: "pending", ms: null })));

    pages.forEach(async (p, i) => {
      const t0 = performance.now();
      try {
        const res = await fetch(p.url, { method: "HEAD", cache: "no-store" });
        const ms = Math.round(performance.now() - t0);
        setPings((prev) => prev.map((r, j) => j === i ? { ...r, status: res.ok ? "ok" : "error", ms } : r));
      } catch {
        const ms = Math.round(performance.now() - t0);
        setPings((prev) => prev.map((r, j) => j === i ? { ...r, status: "error", ms } : r));
      }
    });

    return () => window.removeEventListener("error", handler);
  }, [router]);

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-2 border-[#8b3cf7] border-t-transparent animate-spin" />
      </div>
    );
  }

  const allOk = pings.length > 0 && pings.every((p) => p.status === "ok");
  const anyError = pings.some((p) => p.status === "error");

  return (
    <div className="max-w-5xl mx-auto px-4 py-24">
      <div className="flex items-center gap-4 mb-2">
        <h1 className="text-4xl md:text-5xl font-extrabold">
          <span className="text-[#fb923c]">Maintenance</span>
        </h1>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#fb923c]/20 border border-[#fb923c]/30 text-[#fb923c]">
          Builder only
        </span>
      </div>
      <p className="text-[#f0eaff]/50 text-lg mb-6">Live site performance and diagnostics</p>

      <PortalTabs />

      <div className="grid md:grid-cols-2 gap-6">

        {/* Overall status */}
        <div className="rounded-2xl border border-purple-900/40 bg-[#130d24] p-6 col-span-full">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-3 h-3 rounded-full ${allOk ? "bg-emerald-400" : anyError ? "bg-red-400" : "bg-amber-400 animate-pulse"}`} />
            <h2 className="font-bold text-lg">
              {allOk ? "All systems operational" : anyError ? "Issues detected" : "Checking systems..."}
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://discord.com/developers/applications"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#5865F2]/20 border border-[#5865F2]/30 text-[#5865F2] hover:bg-[#5865F2]/30 transition-colors"
            >
              Discord Developer Portal
            </a>
            <a
              href="https://dash.cloudflare.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#fb923c]/20 border border-[#fb923c]/30 text-[#fb923c] hover:bg-[#fb923c]/30 transition-colors"
            >
              Cloudflare Dashboard
            </a>
          </div>
        </div>

        {/* Page pings */}
        <div className="rounded-2xl border border-purple-900/40 bg-[#130d24] p-6">
          <h2 className="font-bold text-[#c084fc] mb-4">Page Response Times</h2>
          <div className="flex flex-col gap-3">
            {pings.map((p) => (
              <div key={p.page} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <StatusDot status={p.status} />
                  <span className="text-[#f0eaff]/70">{p.page}</span>
                </div>
                <span className={`font-mono text-xs ${
                  p.status === "ok" ? "text-emerald-400" :
                  p.status === "error" ? "text-red-400" : "text-amber-400"
                }`}>{fmt(p.ms)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Load performance */}
        <div className="rounded-2xl border border-purple-900/40 bg-[#130d24] p-6">
          <h2 className="font-bold text-[#c084fc] mb-4">Page Load Breakdown</h2>
          {perf ? (
            <div className="flex flex-col gap-3 text-sm">
              {[
                { label: "DNS Lookup", value: perf.dns },
                { label: "TCP Connect", value: perf.tcp },
                { label: "Time to First Byte", value: perf.ttfb },
                { label: "DOM Ready", value: perf.domReady },
                { label: "Full Load", value: perf.load },
              ].map((m) => (
                <div key={m.label} className="flex items-center justify-between">
                  <span className="text-[#f0eaff]/60">{m.label}</span>
                  <span className={`font-mono text-xs ${m.value < 200 ? "text-emerald-400" : m.value < 800 ? "text-amber-400" : "text-red-400"}`}>
                    {fmt(m.value)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#f0eaff]/30 text-sm">Not available</p>
          )}
        </div>

        {/* Memory & connection */}
        <div className="rounded-2xl border border-purple-900/40 bg-[#130d24] p-6">
          <h2 className="font-bold text-[#c084fc] mb-4">Browser Environment</h2>
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[#f0eaff]/60">User Agent</span>
              <span className="text-[#f0eaff]/40 text-xs max-w-[60%] text-right truncate">{navigator.userAgent.split(" ").slice(-1)[0]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#f0eaff]/60">Connection</span>
              <span className="text-[#2dd4bf] font-mono text-xs">{connection}</span>
            </div>
            {memory && (
              <div className="flex justify-between">
                <span className="text-[#f0eaff]/60">JS Memory</span>
                <span className="text-[#2dd4bf] font-mono text-xs">{memory.used}MB / {memory.total}MB</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[#f0eaff]/60">Online</span>
              <span className={`font-mono text-xs ${navigator.onLine ? "text-emerald-400" : "text-red-400"}`}>
                {navigator.onLine ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>

        {/* JS Errors */}
        <div className="rounded-2xl border border-purple-900/40 bg-[#130d24] p-6">
          <h2 className="font-bold text-[#c084fc] mb-4">
            JS Errors
            <span className="ml-2 text-xs text-[#f0eaff]/30 font-normal">(this session)</span>
          </h2>
          {errors.length === 0 ? (
            <p className="text-emerald-400 text-sm">No errors detected</p>
          ) : (
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
              {errors.map((e, i) => (
                <div key={i} className="text-xs border border-red-900/30 bg-red-900/10 rounded-lg p-3">
                  <p className="text-red-400 font-mono mb-1">{e.message}</p>
                  <p className="text-[#f0eaff]/30">{e.source} · {e.time}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
