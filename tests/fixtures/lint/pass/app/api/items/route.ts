export const dynamic = "force-dynamic";
export const revalidate = 60;
export const runtime = "nodejs";

const headers = {
  "cache-control": "no-store",
  "Content-Type": "application/json",
};

export function generateStaticParams(): { id: string }[] {
  return [{ id: "1" }];
}

export function GET(): Response {
  return Response.json({ items: [] }, { headers });
}

export function HEAD(): Response {
  return new Response("", { headers });
}

export async function POST(request: Request): Promise<Response> {
  const body = await request.text();
  return new Response(body, { headers, status: 201 });
}

export function PUT(): Response {
  return new Response("", { headers, status: 204 });
}

export function PATCH(): Response {
  return new Response("", { headers, status: 204 });
}

export function DELETE(): Response {
  return new Response("", { headers, status: 204 });
}

export function OPTIONS(): Response {
  return new Response("", { headers: { allow: "GET, POST" }, status: 204 });
}
