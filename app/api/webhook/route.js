import { supabase } from "@/app/_lib/supabase";

export async function POST(req) {
  try {
    const body = await req.json();

    // Accept only paid order events
    if (body.meta?.event_name !== "order_created") {
      return new Response("Ignored", { status: 200 });
    }

    const attributes = body.data?.attributes;
    const email = attributes?.user_email;
    const userId = body.meta?.custom_data?.user_id;

    // Product ID (use product_id only)
    const productId =
      attributes?.first_order_item?.product_id ||
      attributes?.order_items?.[0]?.product_id;

    if (!userId || !email || !productId) {
      return new Response("Missing required data", { status: 400 });
    }

    // NEW PLAN MAP
    const PLAN_MAP = {
      // INDIA PLANS
      694744: { plan: "india_30days", days: 30 },
      694745: { plan: "india_lifetime", days: null },

      // GLOBAL PLANS
      694746: { plan: "global_30days", days: 30 },
      560289: { plan: "global_lifetime", days: null },
    };

    const plan = PLAN_MAP[String(productId)];

    if (!plan) {
      return new Response("Unknown product ID — ignored", { status: 200 });
    }

    // Calculate Expiry
    let expiry = null;
    if (plan.days) {
      const now = new Date();
      now.setDate(now.getDate() + plan.days);
      expiry = now.toISOString();
    }

    // Update Supabase User
    const { error } = await supabase
      .from("User")
      .update({
        is_pro_user: true,
        pro_expiry: expiry,
        purchase_plan: plan.plan,
      })
      .eq("id", userId);

    if (error) {
      return new Response("Database error", { status: 500 });
    }

    return new Response("User upgraded", { status: 200 });
  } catch (err) {
    return new Response("Server error", { status: 500 });
  }
}
