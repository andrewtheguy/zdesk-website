// Cloudflare Pages answers a Range request for a static asset with the whole
// file (200), and Safari on iOS will not play a video served that way, so the
// demo videos go through here to be served by byte range (206).

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

export async function onRequestGet({ request, env }: { request: Request; env: Env }) {
  const asset = await env.ASSETS.fetch(new Request(request.url));
  const range = /^bytes=(\d*)-(\d*)$/.exec(request.headers.get("Range")?.trim() ?? "");
  const headers = new Headers(asset.headers);
  headers.set("Accept-Ranges", "bytes");
  // Without a single range this can serve, the whole file is the answer.
  if (!asset.ok || !range || (range[1] === "" && range[2] === "")) {
    return new Response(asset.body, { status: asset.status, headers });
  }

  const body = await asset.arrayBuffer();
  const size = body.byteLength;
  const [start, end] =
    range[1] === ""
      ? [Math.max(size - Number(range[2]), 0), size - 1]
      : [Number(range[1]), range[2] === "" ? size - 1 : Math.min(Number(range[2]), size - 1)];
  if (start >= size || start > end) {
    return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
  }

  headers.set("Content-Range", `bytes ${start}-${end}/${size}`);
  headers.set("Content-Length", String(end - start + 1));
  return new Response(body.slice(start, end + 1), { status: 206, headers });
}
