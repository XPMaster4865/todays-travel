"use client";
import { useEffect, useState } from "react";

type State = { route: string; weekStart: number; championName: string; championCount: number; posterKey?: string };
type RouteEntry = { route: string; author: string; timestamp: number };

export default function DriverOfTheWeek() {
  const [state, setState] = useState<State | null>(null);
  const [leaderboard, setLeaderboard] = useState<{ author: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/dotw/state").then((res) => res.json()),
      fetch("/api/routelog/list").then((res) => res.json()),
    ])
      .then(([dotwData, routeData]: [{ state: State }, { entries: RouteEntry[] }]) => {
        setState(dotwData.state);
        const relevant = (routeData.entries ?? []).filter(
          (e) => e.route === dotwData.state.route && e.timestamp >= dotwData.state.weekStart
        );
        const counts = new Map<string, number>();
        for (const e of relevant) {
          counts.set(e.author, (counts.get(e.author) ?? 0) + 1);
        }
        const sorted = [...counts.entries()]
          .map(([author, count]) => ({ author, count }))
          .sort((a, b) => b.count - a.count);
        setLeaderboard(sorted);
      })
      .finally(() => setLoading(false));
  }, []);

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
        Driver of the <span className="text-[#fbbf24]">Week</span>
      </h1>
      <p className="text-[#f0eaff]/50 text-lg mb-12">
        Every week, one route is chosen. Whoever drives it the most and logs it wins the Driver of the Week role.
      </p>

      <div className="flex flex-col gap-6">
        {/* Current champion */}
        <div className="rounded-2xl border border-[#fbbf24]/40 bg-gradient-to-br from-[#fbbf24]/10 to-transparent p-6">
          <h2 className="font-bold text-[#fbbf24] mb-2">Current Driver of the Week</h2>
          {state?.championName ? (
            <>
              <p className="text-3xl font-extrabold text-[#f0eaff]">{state.championName}</p>
              <p className="text-sm text-[#f0eaff]/50 mt-1">{state.championCount} routes driven</p>
            </>
          ) : (
            <p className="text-[#f0eaff]/40 text-sm">No champion has been crowned yet.</p>
          )}
        </div>

        {/* This week's route */}
        <div className="rounded-2xl border border-purple-900/40 bg-[#130d24] p-6">
          <h2 className="font-bold text-[#c084fc] mb-2">This Week&apos;s Route</h2>
          {state?.route ? (
            <>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-[#8b3cf7] flex items-center justify-center">
                  <span className="text-sm font-extrabold text-white">{state.route}</span>
                </div>
                <p className="text-[#f0eaff]/60 text-sm">
                  Drive this route and log it to compete for this week&apos;s title.
                </p>
              </div>
              {state.posterKey && (
                <img
                  src={`/api/dotw/image?key=${encodeURIComponent(state.posterKey)}`}
                  alt={`Route ${state.route} poster`}
                  className="mt-4 w-full rounded-xl border border-purple-900/40"
                />
              )}
            </>
          ) : (
            <p className="text-[#f0eaff]/40 text-sm">No route has been chosen yet.</p>
          )}
        </div>

        {/* Live leaderboard */}
        <div className="rounded-2xl border border-purple-900/40 bg-[#130d24] p-6">
          <h2 className="font-bold text-lg mb-4 text-[#c084fc]">Live Leaderboard</h2>
          {!state?.route ? (
            <p className="text-[#f0eaff]/40 text-sm">Set a route to start tracking this week&apos;s leaderboard.</p>
          ) : leaderboard.length === 0 ? (
            <p className="text-[#f0eaff]/40 text-sm">No routes logged for this week yet. Be the first!</p>
          ) : (
            <div className="flex flex-col gap-3">
              {leaderboard.map((entry, i) => (
                <div
                  key={entry.author}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 border ${
                    i === 0 ? "border-[#fbbf24]/40 bg-[#fbbf24]/10" : "border-purple-900/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-extrabold w-6 text-center ${i === 0 ? "text-[#fbbf24]" : "text-[#f0eaff]/40"}`}>
                      #{i + 1}
                    </span>
                    <span className="font-semibold text-[#f0eaff]">{entry.author}</span>
                  </div>
                  <span className={`text-sm font-mono ${i === 0 ? "text-[#fbbf24]" : "text-[#2dd4bf]"}`}>
                    {entry.count} routes
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
