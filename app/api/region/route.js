export const runtime = "nodejs"; // 🟢 REQUIRED FIX

import { headers } from "next/headers";

export async function GET(req) {
  let country = "US"; // fallback

  try {
    const h = headers();
    const vercelCountry = h.get("x-vercel-ip-country");

    if (vercelCountry) {
      country = vercelCountry;
    }
  } catch (err) {
    console.error("❌ Failed to read Vercel headers:", err);
  }

  // Debug override: /api/region?cc=IN
  try {
    const url = new URL(req.url);
    const debug = url.searchParams.get("cc");

    if (debug && process.env.NODE_ENV !== "production") {
      console.log("🧪 DEBUG override:", debug);
      country = debug.toUpperCase();
    }
  } catch (err) {
    console.error("❌ URL parsing error:", err);
  }

  console.log("🌏 FINAL COUNTRY:", country);
  console.log("🇮🇳 isIndia:", country === "IN");

  return Response.json({
    country,
    isIndia: country === "IN",
  });
}
