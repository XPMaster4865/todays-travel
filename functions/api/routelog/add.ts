interface Env {
  APP_KV: {
    get(key: string): Promise<string | null>;
    put(key: string, value: string): Promise<void>;
  };
}

type Entry = {
  id: string;
  route: string;
  note: string;
  author: string;
  timestamp: number;
};

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const body = await context.request.json() as { route?: string; note?: string; author?: string };
    const route = (body.route ?? "").trim();

    if (!route) {
      return Response.json({ error: "No route provided" }, { status: 400 });
    }

    const entry: Entry = {
      id: crypto.randomUUID(),
      route: route.slice(0, 32),
      note: (body.note ?? "").slice(0, 280),
      author: (body.author ?? "Unknown").slice(0, 64),
      timestamp: Date.now(),
    };

    const raw = await context.env.APP_KV.get("routelog:entries");
    const entries: Entry[] = raw ? JSON.parse(raw) : [];
    entries.unshift(entry);
    await context.env.APP_KV.put("routelog:entries", JSON.stringify(entries.slice(0, 500)));

    return Response.json({ entry });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
