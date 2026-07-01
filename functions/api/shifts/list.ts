interface Env {
  APP_KV: { get(key: string): Promise<string | null> };
}

export async function onRequestGet(context: { env: Env }) {
  const [entriesRaw, activeRaw] = await Promise.all([
    context.env.APP_KV.get("shifts:entries"),
    context.env.APP_KV.get("shifts:active"),
  ]);
  const entries = entriesRaw ? JSON.parse(entriesRaw) : [];
  const active = activeRaw ? JSON.parse(activeRaw) : {};
  return Response.json({ entries, active });
}
