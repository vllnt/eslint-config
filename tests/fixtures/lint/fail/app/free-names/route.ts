// The same names outside app/api follow the base naming convention.
const MaxItems = 10;
const user_id = 1;

export function GET(): Response {
  return Response.json({ MaxItems, user_id });
}
