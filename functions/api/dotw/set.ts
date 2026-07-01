interface Env {
  APP_KV: {
    get(key: string): Promise<string | null>;
    put(key: string, value: string): Promise<void>;
  };
}

type State = {
  route: string;
  weekStart: number;
  championName: string;
  championCount: number;
};

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const body = await context.request.json() as {
      route?: string;
      resetWeek?: boolean;
      championName?: string;
      championCount?: number;
    };

    const raw = await context.env.APP_KV.get("dotw:state");
    const state: State = raw ? JSON.parse(raw) : {
      route: "",
      weekStart: Date.now(),
      championName: "",
      championCount: 0,
    };

    if (typeof body.route === "string") {
      state.route = body.route.trim().slice(0, 32);
    }
    if (body.resetWeek) {
      state.weekStart = Date.now();
    }
    if (typeof body.championName === "string") {
      state.championName = body.championName.trim().slice(0, 64);
    }
    if (typeof body.championCount === "number" && Number.isFinite(body.championCount)) {
      state.championCount = body.championCount;
    }

    await context.env.APP_KV.put("dotw:state", JSON.stringify(state));

    return Response.json({ state });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
