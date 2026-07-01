interface Env {
  DISCORD_CLIENT_ID: string;
  DISCORD_CLIENT_SECRET: string;
  APP_KV: {
    get(key: string): Promise<string | null>;
    put(key: string, value: string): Promise<void>;
  };
}

const GUILD_ID = "1470821976460496908";

const ROLE_MAP: Record<string, { label: string; colour: string }> = {
  "1470826192964817161": { label: "Owner", colour: "#fbbf24" },
  "1474088338922410158": { label: "Co-Owner", colour: "#c084fc" },
  "1474094063102722090": { label: "Moderator", colour: "#2dd4bf" },
  "1479607810181435516": { label: "Driver", colour: "#60a5fa" },
  "1496472869868273724": { label: "Driving Instructor", colour: "#34d399" },
  "1489524705324040274": { label: "Media Team", colour: "#f472b6" },
  "1490383449096458260": { label: "Head of Media", colour: "#f472b6" },
};

type Role = { label: string; colour: string };
type Member = {
  id: string;
  username: string;
  globalName: string;
  avatar: string | null;
  roles: Role[];
  inServer: boolean;
  lastLogin: number;
};

async function recordMember(env: Env, member: Omit<Member, "lastLogin">) {
  const raw = await env.APP_KV.get("members:list");
  const members: Record<string, Member> = raw ? JSON.parse(raw) : {};
  const existing = members[member.id];
  // Preserve any manually redeemed roles (e.g. Builder) not tied to a Discord role
  const extraRoles = existing
    ? existing.roles.filter((r) => !member.roles.some((mr) => mr.label === r.label) && !Object.values(ROLE_MAP).some((rm) => rm.label === r.label))
    : [];

  members[member.id] = {
    ...member,
    roles: [...member.roles, ...extraRoles],
    lastLogin: Date.now(),
  };
  await env.APP_KV.put("members:list", JSON.stringify(members));
}

export async function onRequestGet(context: { request: Request; env: Env }) {
  const url = new URL(context.request.url);
  const code = url.searchParams.get("code");
  const origin = `${url.protocol}//${url.host}`;

  if (!code) {
    return Response.redirect(`${origin}/portal?error=no_code`);
  }

  try {
    // Exchange code for access token
    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: context.env.DISCORD_CLIENT_ID,
        client_secret: context.env.DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: `${origin}/api/auth/callback`,
      }),
    });

    const tokenData = await tokenRes.json() as Record<string, string>;

    if (!tokenData.access_token) {
      return Response.redirect(`${origin}/portal?error=token_failed`);
    }

    const accessToken = tokenData.access_token;

    // Fetch Discord user
    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const user = await userRes.json() as Record<string, string>;

    // Fetch guild member to get roles
    const memberRes = await fetch(
      `https://discord.com/api/users/@me/guilds/${GUILD_ID}/member`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const member = await memberRes.json() as { roles?: string[]; message?: string };

    if (member.message) {
      // Not in the server
      const payload = {
        id: user.id,
        username: user.username,
        globalName: user.global_name || user.username,
        avatar: user.avatar
          ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`
          : null,
        roles: [],
        inServer: false,
      };
      await recordMember(context.env, payload);
      const encoded = btoa(encodeURIComponent(JSON.stringify(payload)));
      return Response.redirect(`${origin}/portal#${encoded}`);
    }

    const mappedRoles = (member.roles || [])
      .filter((id) => ROLE_MAP[id])
      .map((id) => ROLE_MAP[id]);

    const payload = {
      id: user.id,
      username: user.username,
      globalName: user.global_name || user.username,
      avatar: user.avatar
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`
        : null,
      roles: mappedRoles,
      inServer: true,
    };

    await recordMember(context.env, payload);
    const encoded = btoa(encodeURIComponent(JSON.stringify(payload)));
    return Response.redirect(`${origin}/portal#${encoded}`);
  } catch {
    return Response.redirect(`${origin}/portal?error=server_error`);
  }
}
