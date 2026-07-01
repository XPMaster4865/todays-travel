interface Env {
  APP_KV: {
    get(key: string): Promise<string | null>;
    put(key: string, value: string): Promise<void>;
  };
}

type Entry = { id: string; balance: number; author: string; timestamp: number };

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const body = await context.request.json() as { id?: string };
    if (!body.id) {
      return Response.json({ error: "No id provided" }, { status: 400 });
    }

    const raw = await context.env.APP_KV.get("funds:entries");
    const entries: Entry[] = raw ? JSON.parse(raw) : [];
    const filtered = entries.filter((e) => e.id !== body.id);
    await context.env.APP_KV.put("funds:entries", JSON.stringify(filtered));

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
