interface Env {
  APP_KV: { get(key: string): Promise<string | null> };
}

export async function onRequestGet(context: { env: Env }) {
  const raw = await context.env.APP_KV.get("routelog:entries");
  const entries = raw ? JSON.parse(raw) : [];
  return Response.json({ entries });
}
