interface Env {
  FUNDS_KV: {
    get(key: string): Promise<string | null>;
    put(key: string, value: string): Promise<void>;
  };
}

type Entry = {
  id: string;
  balance: number;
  note: string;
  author: string;
  timestamp: number;
};

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const body = await context.request.json() as { balance?: number; note?: string; author?: string };

    if (typeof body.balance !== "number" || !Number.isFinite(body.balance)) {
      return Response.json({ error: "Invalid balance" }, { status: 400 });
    }

    const entry: Entry = {
      id: crypto.randomUUID(),
      balance: body.balance,
      note: (body.note ?? "").slice(0, 280),
      author: (body.author ?? "Unknown").slice(0, 64),
      timestamp: Date.now(),
    };

    const raw = await context.env.FUNDS_KV.get("entries");
    const entries: Entry[] = raw ? JSON.parse(raw) : [];
    entries.unshift(entry);
    await context.env.FUNDS_KV.put("entries", JSON.stringify(entries.slice(0, 200)));

    return Response.json({ entry });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
