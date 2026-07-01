interface Env {
  DISCORD_CLIENT_ID: string;
  DISCORD_CLIENT_SECRET: string;
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

    const encoded = btoa(encodeURIComponent(JSON.stringify(payload)));
    return Response.redirect(`${origin}/portal#${encoded}`);
  } catch {
    return Response.redirect(`${origin}/portal?error=server_error`);
  }
}
