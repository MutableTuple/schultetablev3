import { supabase } from "@/app/_lib/supabase";
import crypto from "crypto";

// Ensures this route always runs in the Node.js runtime (not Edge) — required
// since it uses Node's crypto module (createHmac / timingSafeEqual) below.
export const runtime = "nodejs";

export async function POST(req) {
  try {
    const rawBody = await req.text();

    // Verify this request actually came from Lemon Squeezy before trusting
    // anything in it. Without this, anyone can POST a fake "order_created"
    // event with an arbitrary user_id and grant themselves free Pro access —
    // this check is what makes the whole route safe to trust.
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    if (!secret) {
      console.error("LEMONSQUEEZY_WEBHOOK_SECRET is not set");
      return new Response("Server misconfigured", { status: 500 });
    }

    const signature = req.headers.get("x-signature");
    if (!signature) {
      return new Response("Missing signature", { status: 401 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    const signatureBuffer = Buffer.from(signature, "utf8");
    const expectedBuffer = Buffer.from(expectedSignature, "utf8");
    const isValid =
      signatureBuffer.length === expectedBuffer.length &&
      crypto.timingSafeEqual(signatureBuffer, expectedBuffer);

    if (!isValid) {
      console.error("Invalid Lemon Squeezy webhook signature");
      return new Response("Invalid signature", { status: 401 });
    }

    let body;
    try {
      body = JSON.parse(rawBody);
    } catch {
      console.error("Webhook body is not valid JSON");
      return new Response("Invalid payload", { status: 400 });
    }

    console.log("Lemon Squeezy webhook:", body?.meta?.event_name);

    // Only handle successful order creation
    if (body.meta?.event_name !== "order_created") {
      return new Response("Ignored", { status: 200 });
    }

    const attributes = body.data?.attributes;

    const email = attributes?.user_email;
    const userId = body.meta?.custom_data?.user_id;

    const productId = Number(
      attributes?.first_order_item?.product_id ??
        attributes?.order_items?.[0]?.product_id,
    );

    console.log("Webhook payload data:", {
      userId,
      email,
      productId,
    });

    // Protect against invalid IDs from checkout creation
    if (
      !userId ||
      userId === "undefined" ||
      userId === "null" ||
      !email ||
      !productId
    ) {
      console.error("Invalid webhook data:", {
        userId,
        email,
        productId,
      });

      return new Response("Missing required data", {
        status: 400,
      });
    }

    const PLAN_MAP = {
      // INDIA
      694716: {
        plan: "india_30days",
        days: 30,
      },
      694720: {
        plan: "india_lifetime",
        days: null,
      },

      // GLOBAL
      694721: {
        plan: "global_30days",
        days: 30,
      },
      560283: {
        plan: "global_lifetime",
        days: null,
      },
    };

    const plan = PLAN_MAP[productId];

    if (!plan) {
      console.error("Unknown Lemon Squeezy product:", productId);

      return new Response("Unknown product ID — ignored", {
        status: 200,
      });
    }

    let expiry = null;

    if (plan.days) {
      const now = new Date();

      now.setDate(now.getDate() + plan.days);

      expiry = now.toISOString();
    }

    const { data, error } = await supabase
      .from("User")
      .update({
        is_pro_user: true,
        pro_expiry: expiry,
        purchase_plan: plan.plan,
      })
      .eq("id", userId)
      .select();

    if (error) {
      console.error("Supabase update error:", error);

      return new Response("Database error", {
        status: 500,
      });
    }

    if (!data || data.length === 0) {
      console.error("No user found for webhook user ID:", userId);

      return new Response("User not found", {
        status: 404,
      });
    }

    console.log(`User ${userId} upgraded to ${plan.plan}`);

    return new Response("User upgraded", {
      status: 200,
    });
  } catch (err) {
    console.error("Webhook error:", err);

    return new Response("Server error", {
      status: 500,
    });
  }
}
