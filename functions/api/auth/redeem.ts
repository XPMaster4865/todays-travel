interface Env {
  ROLE_CODES: string; // JSON: { "CODE": { "label": "Role", "colour": "#hex" } }
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const body = await context.request.json() as { code: string };
    const code = (body.code ?? "").trim().toUpperCase();

    if (!code) {
      return Response.json({ error: "No code provided" }, { status: 400 });
    }

    const codes: Record<string, { label: string; colour: string }> = JSON.parse(
      context.env.ROLE_CODES ?? "{}"
    );

    const role = codes[code];

    if (!role) {
      return Response.json({ error: "Invalid code" }, { status: 404 });
    }

    return Response.json({ role });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
