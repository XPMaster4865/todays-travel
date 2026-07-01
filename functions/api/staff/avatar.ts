interface Env {
  DISCORD_BOT_TOKEN: string;
}

export async function onRequestGet(context: { request: Request; env: Env }) {
  const url = new URL(context.request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return new Response("Missing id", { status: 400 });
  }

  try {
    const userRes = await fetch(`https://discord.com/api/v10/users/${id}`, {
      headers: { Authorization: `Bot ${context.env.DISCORD_BOT_TOKEN}` },
    });

    if (!userRes.ok) {
      const detail = await userRes.text();
      return new Response(`Discord API error ${userRes.status}: ${detail}. Token present: ${Boolean(context.env.DISCORD_BOT_TOKEN)}`, { status: 500 });
    }

    const user = await userRes.json() as { avatar: string | null };
    const avatarUrl = user.avatar
      ? `https://cdn.discordapp.com/avatars/${id}/${user.avatar}.png?size=128`
      : "https://cdn.discordapp.com/embed/avatars/0.png";

    const imageRes = await fetch(avatarUrl);
    if (!imageRes.ok || !imageRes.body) {
      return Response.redirect("https://cdn.discordapp.com/embed/avatars/0.png", 302);
    }

    return new Response(imageRes.body, {
      headers: {
        "Content-Type": imageRes.headers.get("Content-Type") ?? "image/png",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return Response.redirect("https://cdn.discordapp.com/embed/avatars/0.png", 302);
  }
}
