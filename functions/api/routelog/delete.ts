interface R2Bucket {
  delete(key: string): Promise<void>;
}

interface Env {
  APP_KV: {
    get(key: string): Promise<string | null>;
    put(key: string, value: string): Promise<void>;
  };
  ROUTE_IMAGES: R2Bucket;
}

type Entry = { id: string; route: string; note: string; author: string; timestamp: number; imageKey: string };

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const body = await context.request.json() as { id?: string };
    if (!body.id) {
      return Response.json({ error: "No id provided" }, { status: 400 });
    }

    const raw = await context.env.APP_KV.get("routelog:entries");
    const entries: Entry[] = raw ? JSON.parse(raw) : [];
    const target = entries.find((e) => e.id === body.id);
    const filtered = entries.filter((e) => e.id !== body.id);
    await context.env.APP_KV.put("routelog:entries", JSON.stringify(filtered));

    if (target?.imageKey) {
      await context.env.ROUTE_IMAGES.delete(target.imageKey);
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
