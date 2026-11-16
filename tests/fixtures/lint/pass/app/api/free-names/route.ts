// The naming convention is off under app/api, as it has always been, so
// these names pass.
const MaxItems = 10;
const user_id = 1;

export function GET(): Response {
  return Response.json({ MaxItems, user_id });
}
