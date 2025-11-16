export async function GET(req) {
  const url = new URL(req.url);
  const debug = url.searchParams.get("cc"); // example: ?cc=IN

  let country = headers().get("x-vercel-ip-country") || "US";

  // force country in dev mode
  if (process.env.NODE_ENV !== "production" && debug) {
    country = debug.toUpperCase();
  }

  return Response.json({
    country,
    isIndia: country === "IN",
  });
}
