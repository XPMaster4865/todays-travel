interface R2Bucket {
  put(key: string, value: ArrayBuffer, opts?: { httpMetadata?: { contentType?: string } }): Promise<unknown>;
}

interface Env {
  APP_KV: {
    get(key: string): Promise<string | null>;
    put(key: string, value: string): Promise<void>;
  };
  ROUTE_IMAGES: R2Bucket;
}

type State = {
  route: string;
  weekStart: number;
  championName: string;
  championCount: number;
  posterKey?: string;
};

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const form = await context.request.formData();
    const image = form.get("image");

    if (!(image instanceof File) || image.size === 0) {
      return Response.json({ error: "No image provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(image.type)) {
      return Response.json({ error: "Image must be PNG, JPEG, or WEBP" }, { status: 400 });
    }

    const ext = image.type === "image/png" ? "png" : image.type === "image/webp" ? "webp" : "jpg";
    const posterKey = `dotw/${crypto.randomUUID()}.${ext}`;

    await context.env.ROUTE_IMAGES.put(posterKey, await image.arrayBuffer(), {
      httpMetadata: { contentType: image.type },
    });

    const raw = await context.env.APP_KV.get("dotw:state");
    const state: State = raw ? JSON.parse(raw) : {
      route: "",
      weekStart: Date.now(),
      championName: "",
      championCount: 0,
    };
    state.posterKey = posterKey;
    await context.env.APP_KV.put("dotw:state", JSON.stringify(state));

    return Response.json({ state });
  } catch (err) {
    return Response.json({ error: "Server error", detail: String(err) }, { status: 500 });
  }
}
