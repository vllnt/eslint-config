export function GET(): Response {
  const lines: string[] = [];
  for (const name of ["a", "b"]) {
    lines.push(name);
  }
  return new Response(lines.join("\n"));
}
