export const dynamic = "force-dynamic";

export function GET(): Response {
  return new Response("User-agent: *\nAllow: /\n", {
    headers: { "content-type": "text/plain; charset=utf-8" },
    status: 200,
  });
}
