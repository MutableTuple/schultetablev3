import { supabase } from "@/app/_lib/supabase";

export async function POST(req) {
  try {
    const body = await req.json();

    // 1. Only accept paid order events
    if (body.meta?.event_name !== "order_created") {
      return new Response("Ignored non-order event", { status: 200 });
    }

    const attributes = body.data?.attributes;
    const email = attributes?.user_email;
    const userId = body.meta?.custom_data?.user_id;

    // 2. Product ID (LS gives 2 possible locations)
    const productId =
      attributes?.first_order_item?.product_id ||
      attributes?.order_items?.[0]?.product_id;

    if (!userId || !email || !productId) {
      console.error("❌ Missing webhook fields", { userId, email, productId });
      return new Response("Missing required data", { status: 400 });
    }

    // 3. Product → Plan mapping
    const PLAN_MAP = {
      // INDIA
      "da963873-e5af-4eca-98d3-5372b43d2b94": {
        plan: "india_30days",
        days: 30,
      },
      "d73e877b-7b15-4813-b958-1fdd4bd07212": {
        plan: "india_lifetime",
        days: null,
      },

      // GLOBAL
      "6f0853e5-b4c8-4db3-a68c-8324a06f49d9": {
        plan: "global_30days",
        days: 30,
      },
      "f8eb6dde-bf7a-4f7e-912e-8b29fcc1490b": {
        plan: "global_lifetime",
        days: null,
      },
    };

    const plan = PLAN_MAP[String(productId)];

    if (!plan) {
      console.log("⚠️ Product not mapped. Ignored:", productId);
      return new Response("Ignored", { status: 200 });
    }

    // 4. Calculate expiry
    let expiry = null;

    if (plan.days) {
      expiry = new Date();
      expiry.setDate(expiry.getDate() + plan.days);
    }

    // 5. Update SUPABASE USER record
    const { error } = await supabase
      .from("User")
      .update({
        is_pro_user: true,
        pro_expiry: expiry, // null for lifetime
        purchase_plan: plan.plan,
      })
      .eq("id", userId);

    if (error) {
      console.error("❌ Supabase update error:", error);
      return new Response("Database error", { status: 500 });
    }

    console.log(
      `✅ User upgraded: ${userId} → ${plan.plan} (expiry: ${
        expiry ?? "lifetime"
      })`
    );

    return new Response("User upgraded to Pro", { status: 200 });
  } catch (err) {
    console.error("❌ Webhook processing error:", err);
    return new Response("Server error", { status: 500 });
  }
}
