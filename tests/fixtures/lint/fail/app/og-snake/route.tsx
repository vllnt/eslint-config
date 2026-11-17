// The `.tsx` naming rule still rejects a snake_case function.
function render_card(title: string): string {
  return `<h1>${title}</h1>`;
}

export function GET(): Response {
  return new Response(render_card("vllnt"));
}
