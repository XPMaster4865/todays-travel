interface Env {
  APP_KV: {
    get(key: string): Promise<string | null>;
    put(key: string, value: string): Promise<void>;
  };
}

type ActiveShift = { startedAt: number; author: string };
type ShiftEntry = {
  id: string;
  userId: string;
  author: string;
  startedAt: number;
  endedAt: number;
};

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const body = await context.request.json() as { userId?: string; author?: string; action?: "start" | "end" };
    const userId = (body.userId ?? "").trim();
    const author = (body.author ?? "Unknown").slice(0, 64);
    const action = body.action;

    if (!userId || (action !== "start" && action !== "end")) {
      return Response.json({ error: "Invalid request" }, { status: 400 });
    }

    const activeRaw = await context.env.APP_KV.get("shifts:active");
    const active: Record<string, ActiveShift> = activeRaw ? JSON.parse(activeRaw) : {};

    if (action === "start") {
      if (active[userId]) {
        return Response.json({ error: "Shift already in progress" }, { status: 409 });
      }
      active[userId] = { startedAt: Date.now(), author };
      await context.env.APP_KV.put("shifts:active", JSON.stringify(active));
      return Response.json({ active: active[userId] });
    }

    // action === "end"
    const current = active[userId];
    if (!current) {
      return Response.json({ error: "No shift in progress" }, { status: 409 });
    }
    delete active[userId];
    await context.env.APP_KV.put("shifts:active", JSON.stringify(active));

    const entry: ShiftEntry = {
      id: crypto.randomUUID(),
      userId,
      author,
      startedAt: current.startedAt,
      endedAt: Date.now(),
    };

    const entriesRaw = await context.env.APP_KV.get("shifts:entries");
    const entries: ShiftEntry[] = entriesRaw ? JSON.parse(entriesRaw) : [];
    entries.unshift(entry);
    await context.env.APP_KV.put("shifts:entries", JSON.stringify(entries.slice(0, 500)));

    return Response.json({ entry });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
