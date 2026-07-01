interface Env {
  APP_KV: { get(key: string): Promise<string | null> };
}

type ActiveShift = { startedAt: number; author: string };
type ShiftEntry = { id: string; userId: string; author: string; startedAt: number; endedAt: number };

export async function onRequestGet(context: { request: Request; env: Env }) {
  const url = new URL(context.request.url);
  const userId = url.searchParams.get("userId");

  const [entriesRaw, activeRaw] = await Promise.all([
    context.env.APP_KV.get("shifts:entries"),
    context.env.APP_KV.get("shifts:active"),
  ]);
  const allEntries: ShiftEntry[] = entriesRaw ? JSON.parse(entriesRaw) : [];
  const allActive: Record<string, ActiveShift> = activeRaw ? JSON.parse(activeRaw) : {};

  if (!userId) {
    return Response.json({ entries: [], active: {} });
  }

  const entries = allEntries.filter((e) => e.userId === userId);
  const active = allActive[userId] ? { [userId]: allActive[userId] } : {};

  return Response.json({ entries, active });
}
