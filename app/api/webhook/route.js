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
      "470240d2-a5ee-4def-92c0-394c2ecf0579": {
        plan: "india_30days",
        days: 30,
      },
      "1d34e5e2-5140-4a77-b8ce-72f5615aea97": {
        plan: "india_lifetime",
        days: null,
      },

      // GLOBAL
      "a66627cf-a706-41aa-af08-5438b49b17e9": {
        plan: "global_30days",
        days: 30,
      },
      "a7ae0450-6c1d-4aa1-92c0-dfce4e3edf6e": {
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
