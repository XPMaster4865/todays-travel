interface R2Bucket {
  put(key: string, value: ArrayBuffer, opts?: { httpMetadata?: { contentType?: string } }): Promise<unknown>;
}

interface Env {
  ROUTE_IMAGES: R2Bucket;
}

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const form = await context.request.formData();
    const files = form.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);

    if (files.length === 0) {
      return Response.json({ error: "No images provided" }, { status: 400 });
    }

    const uploaded: string[] = [];
    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) continue;
      const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
      const key = `gallery/${crypto.randomUUID()}.${ext}`;
      await context.env.ROUTE_IMAGES.put(key, await file.arrayBuffer(), {
        httpMetadata: { contentType: file.type },
      });
      uploaded.push(key);
    }

    if (uploaded.length === 0) {
      return Response.json({ error: "No valid images (PNG, JPEG, or WEBP only)" }, { status: 400 });
    }

    return Response.json({ uploaded });
  } catch (err) {
    return Response.json({ error: "Server error", detail: String(err) }, { status: 500 });
  }
}
