interface R2Object {
  key: string;
  uploaded: string;
}

interface R2ListResult {
  objects: R2Object[];
  truncated: boolean;
  cursor?: string;
}

interface R2Bucket {
  list(opts: { prefix?: string; cursor?: string }): Promise<R2ListResult>;
}

interface Env {
  ROUTE_IMAGES: R2Bucket;
}

export async function onRequestGet(context: { env: Env }) {
  const objects: R2Object[] = [];
  let cursor: string | undefined;

  do {
    const result = await context.env.ROUTE_IMAGES.list({ prefix: "gallery/", cursor });
    objects.push(...result.objects);
    cursor = result.truncated ? result.cursor : undefined;
  } while (cursor);

  const images = objects
    .sort((a, b) => new Date(b.uploaded).getTime() - new Date(a.uploaded).getTime())
    .map((o) => o.key);

  return Response.json({ images });
}
