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

type Entry = {
  id: string;
  route: string;
  note: string;
  author: string;
  timestamp: number;
  imageKey: string;
};

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const form = await context.request.formData();
    const route = (form.get("route") as string ?? "").trim();
    const note = (form.get("note") as string ?? "").trim();
    const author = (form.get("author") as string ?? "Unknown").trim();
    const image = form.get("image");

    if (!route) {
      return Response.json({ error: "No route provided" }, { status: 400 });
    }

    if (!(image instanceof File) || image.size === 0) {
      return Response.json({ error: "A finish screen screenshot is required" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(image.type)) {
      return Response.json({ error: "Image must be PNG, JPEG, or WEBP" }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const ext = image.type === "image/png" ? "png" : image.type === "image/webp" ? "webp" : "jpg";
    const imageKey = `routelog/${id}.${ext}`;

    await context.env.ROUTE_IMAGES.put(imageKey, await image.arrayBuffer(), {
      httpMetadata: { contentType: image.type },
    });

    const entry: Entry = {
      id,
      route: route.slice(0, 32),
      note: note.slice(0, 280),
      author: author.slice(0, 64),
      timestamp: Date.now(),
      imageKey,
    };

    const raw = await context.env.APP_KV.get("routelog:entries");
    const entries: Entry[] = raw ? JSON.parse(raw) : [];
    entries.unshift(entry);
    await context.env.APP_KV.put("routelog:entries", JSON.stringify(entries.slice(0, 500)));

    return Response.json({ entry });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
