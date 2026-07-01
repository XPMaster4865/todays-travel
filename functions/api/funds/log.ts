interface Env {
  APP_KV: {
    get(key: string): Promise<string | null>;
    put(key: string, value: string): Promise<void>;
  };
}

type Entry = {
  id: string;
  balance: number;
  author: string;
  timestamp: number;
};

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const body = await context.request.json() as { balance?: number; author?: string };

    if (typeof body.balance !== "number" || !Number.isFinite(body.balance)) {
      return Response.json({ error: "Invalid balance" }, { status: 400 });
    }

    const entry: Entry = {
      id: crypto.randomUUID(),
      balance: body.balance,
      author: (body.author ?? "Unknown").slice(0, 64),
      timestamp: Date.now(),
    };

    const raw = await context.env.APP_KV.get("funds:entries");
    const entries: Entry[] = raw ? JSON.parse(raw) : [];
    entries.unshift(entry);
    await context.env.APP_KV.put("funds:entries", JSON.stringify(entries.slice(0, 200)));

    return Response.json({ entry });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
