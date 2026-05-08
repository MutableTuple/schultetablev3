import { createUserClient } from "@/app/_lib/supabaseServer";

/* ======================
   GET USERS (SECURE)
====================== */
export async function GET(req) {
  try {
    const supabase = await createUserClient();

    // 🔐 1. Require logged-in user (cookies must be sent from frontend)
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🔐 2. Internal request check
    const internalHeader = req.headers.get("x-internal-request");
    const isInternal = internalHeader === "true";

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const username = searchParams.get("username");

    /* ======================
       GET BY ID
    ====================== */
    if (id) {
      const { data, error } = await supabase
        .from("User")
        .select(
          "id, name, image, score, username, bio, nationality, social_link",
        )
        .eq("id", id)
        .single();

      if (error) {
        return Response.json({ error: error.message }, { status: 500 });
      }

      return Response.json(data);
    }

    /* ======================
       GET BY USERNAME
    ====================== */
    if (username) {
      const { data, error } = await supabase
        .from("User")
        .select("id, name, image, score, username")
        .eq("username", username)
        .single();

      if (error) {
        return Response.json({ error: error.message }, { status: 500 });
      }

      return Response.json(data);
    }

    /* ======================
       GET ALL USERS (INTERNAL ONLY)
    ====================== */
    if (isInternal) {
      const { data, error } = await supabase
        .from("User")
        .select("id, name, image, username, score")
        .limit(50); // 🔥 safety limit

      if (error) {
        return Response.json({ error: error.message }, { status: 500 });
      }

      return Response.json(data);
    }

    // ❌ Block everything else
    return Response.json({ error: "Forbidden" }, { status: 403 });
  } catch (err) {
    console.error("GET ERROR:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

/* ======================
   CREATE USER (SECURE)
====================== */
export async function POST(req) {
  try {
    const supabase = await createUserClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const safeBody = {
      ...body,
      id: user.id, // 🔒 prevent spoofing
    };

    const { data, error } = await supabase
      .from("User")
      .insert([safeBody])
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data);
  } catch (err) {
    console.error("POST ERROR:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

/* ======================
   UPDATE PROFILE (SECURE)
====================== */
export async function PATCH(req) {
  try {
    const supabase = await createUserClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...updates } = body;

    // 🔒 Prevent editing others
    if (id !== user.id) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("User")
      .update(updates)
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data);
  } catch (err) {
    console.error("PATCH ERROR:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
