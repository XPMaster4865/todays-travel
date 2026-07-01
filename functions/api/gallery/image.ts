interface R2Object {
  body: ReadableStream;
  httpMetadata?: { contentType?: string };
}

interface R2Bucket {
  get(key: string): Promise<R2Object | null>;
}

interface Env {
  ROUTE_IMAGES: R2Bucket;
}

export async function onRequestGet(context: { request: Request; env: Env }) {
  const url = new URL(context.request.url);
  const key = url.searchParams.get("key");

  if (!key || !key.startsWith("gallery/")) {
    return new Response("Not found", { status: 404 });
  }

  const object = await context.env.ROUTE_IMAGES.get(key);
  if (!object) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(object.body, {
    headers: {
      "Content-Type": object.httpMetadata?.contentType ?? "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
