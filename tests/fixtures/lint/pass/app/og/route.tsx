// A `.tsx` route file keeps the `.tsx` naming rule, which allows PascalCase
// functions such as this JSX helper.
function Card({ title }: { title: string }) {
  return <h1>{title}</h1>;
}

export function GET(): Response {
  return Response.json({ card: Card({ title: "vllnt" }) });
}
