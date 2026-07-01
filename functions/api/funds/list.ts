interface Env {
  FUNDS_KV: { get(key: string): Promise<string | null> };
}

export async function onRequestGet(context: { env: Env }) {
  const raw = await context.env.FUNDS_KV.get("entries");
  const entries = raw ? JSON.parse(raw) : [];
  return Response.json({ entries });
}
