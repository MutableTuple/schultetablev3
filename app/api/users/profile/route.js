import { NextResponse } from "next/server";
import { createUserClient } from "@/app/_lib/supabaseServer";

// simple memory store
const rateLimit = new Map();

const LIMIT = 2;
const WINDOW = 5000; // 5 seconds

export async function PATCH(req) {
  try {
    console.log("========== PROFILE PATCH START ==========");

    const body = await req.json();
    console.log("Incoming Body:", body);

    const { userId, name, socialLink, bio, nationality, image } = body;

    console.log("Parsed Values:", {
      userId,
      name,
      socialLink,
      bio,
      nationality,
      image,
    });

    if (!userId) {
      console.log("ERROR: Missing userId");

      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    // ---------- RATE LIMIT ----------
    const now = Date.now();
    const userData = rateLimit.get(userId);

    console.log("RateLimit Existing Data:", userData);

    if (userData) {
      const { count, start } = userData;

      if (now - start < WINDOW) {
        if (count >= LIMIT) {
          console.log("RATE LIMITED:", userId);

          return NextResponse.json(
            { error: "Too many updates. Please wait 5 seconds." },
            { status: 429 }
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

    console.log("Updated RateLimit Store:", rateLimit.get(userId));
    // --------------------------------

    const supabaseServer = await createUserClient();

    console.log("Supabase Client Created:", !!supabaseServer);

    const payload = {
      name,
      social_link: socialLink,
      bio,
      nationality,
      image,
    };

    console.log("Supabase Update Payload:", payload);
    console.log("Updating Row Where id =", userId);

    const { data, error } = await supabaseServer
      .from("User")
      .update(payload)
      .eq("id", userId)
      .select()
      .maybeSingle();

    console.log("Supabase Data:", data);
    console.log("Supabase Error:", error);

    if (error) {
      console.log("UPDATE FAILED");

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    console.log("UPDATE SUCCESS");
    console.log("========== PROFILE PATCH END ==========");

    return NextResponse.json(data);
  } catch (err) {
    console.log("SERVER CRASH ERROR:", err);

    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}