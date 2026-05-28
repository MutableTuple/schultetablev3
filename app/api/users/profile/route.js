import { NextResponse } from "next/server";
import { createUserClient } from "@/app/_lib/supabaseServer";
// simple memory store
const rateLimit = new Map();

const LIMIT = 2;
const WINDOW = 5000; // 5 seconds

export async function PATCH(req) {
  try {
    const body = await req.json();

    const { userId, name, socialLink, bio, nationality, image } = body;

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // ---------- RATE LIMIT ----------
    const now = Date.now();
    const userData = rateLimit.get(userId);

    if (userData) {
      const { count, start } = userData;

      if (now - start < WINDOW) {
        if (count >= LIMIT) {
          return NextResponse.json(
            { error: "Too many updates. Please wait 5 seconds." },
            { status: 429 },
          );
        }

        rateLimit.set(userId, {
          count: count + 1,
          start,
        });
      } else {
        rateLimit.set(userId, {
          count: 1,
          start: now,
        });
      }
    } else {
      rateLimit.set(userId, {
        count: 1,
        start: now,
      });
    }

    // --------------------------------

    const supabaseServer = await createUserClient();

    const payload = {
      name,
      social_link: socialLink,
      bio,
      nationality,
      image,
    };

    const { data, error } = await supabaseServer
      .from("User")
      .update(payload)
      .eq("id", userId)
      .select()
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 },
    );
  }
}
