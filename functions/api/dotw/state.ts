interface Env {
  APP_KV: { get(key: string): Promise<string | null> };
}

export async function onRequestGet(context: { env: Env }) {
  const raw = await context.env.APP_KV.get("dotw:state");
  const state = raw ? JSON.parse(raw) : {
    route: "",
    weekStart: Date.now(),
    championName: "",
    championCount: 0,
  };
  return Response.json({ state });
}
