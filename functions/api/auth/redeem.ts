interface Role {
  label: string;
  colour: string;
}

interface Member {
  id: string;
  username: string;
  globalName: string;
  avatar: string | null;
  roles: Role[];
  inServer: boolean;
  lastLogin: number;
}

interface Env {
  ROLE_CODES: string; // JSON: { "CODE": { "label": "Role", "colour": "#hex" } }
  APP_KV: {
    get(key: string): Promise<string | null>;
    put(key: string, value: string): Promise<void>;
  };
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const body = await context.request.json() as {
      code: string;
      userId?: string;
      globalName?: string;
      username?: string;
      avatar?: string | null;
    };
    const code = (body.code ?? "").trim().toUpperCase();

    if (!code) {
      return Response.json({ error: "No code provided" }, { status: 400 });
    }

    const codes: Record<string, Role> = JSON.parse(context.env.ROLE_CODES ?? "{}");
    const role = codes[code];

    if (!role) {
      return Response.json({ error: "Invalid code" }, { status: 404 });
    }

    if (body.userId) {
      const raw = await context.env.APP_KV.get("members:list");
      const members: Record<string, Member> = raw ? JSON.parse(raw) : {};
      const existing = members[body.userId];
      const roles = existing ? [...existing.roles] : [];
      if (!roles.some((r) => r.label === role.label)) roles.push(role);

      members[body.userId] = {
        id: body.userId,
        username: body.username ?? existing?.username ?? "Unknown",
        globalName: body.globalName ?? existing?.globalName ?? "Unknown",
        avatar: body.avatar ?? existing?.avatar ?? null,
        roles,
        inServer: existing?.inServer ?? true,
        lastLogin: existing?.lastLogin ?? Date.now(),
      };
      await context.env.APP_KV.put("members:list", JSON.stringify(members));
    }

    return Response.json({ role });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
