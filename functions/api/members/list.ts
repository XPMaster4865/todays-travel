interface Env {
  APP_KV: { get(key: string): Promise<string | null> };
}

export async function onRequestGet(context: { env: Env }) {
  const raw = await context.env.APP_KV.get("members:list");
  const members = raw ? Object.values(JSON.parse(raw)) : [];
  return Response.json({ members });
}
