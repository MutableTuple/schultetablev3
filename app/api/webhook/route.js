import { supabase } from "@/app/_lib/supabase";

export async function POST(req) {
  try {
    const body = await req.json();

    // Massive debug log object
    const LOG = {
      raw_body: body,
      step: "START",
      extracted: {},
      plan_info: {},
      supabase_payload: {},
      supabase_response: {},
    };

    // 1. Verify event
    LOG.step = "verify_event";
    if (body.meta?.event_name !== "order_created") {
      LOG.reason = "Ignored non-order event";
      console.log(JSON.stringify(LOG, null, 2));
      return new Response("Ignored non-order event", { status: 200 });
    }

    const attributes = body.data?.attributes;
    const email = attributes?.user_email;
    const userId = body.meta?.custom_data?.user_id;

    // 2. Detect product ID (product_id OR variant_id)
    const productId =
      attributes?.first_order_item?.variant_id ||
      attributes?.first_order_item?.product_id ||
      attributes?.order_items?.[0]?.variant_id ||
      attributes?.order_items?.[0]?.product_id;

    LOG.extracted = { email, userId, productId };

    if (!userId || !email || !productId) {
      LOG.error = "Missing required fields for webhook processing";
      console.log(JSON.stringify(LOG, null, 2));
      return new Response("Missing required data", { status: 400 });
    }

    // 3. Product Map
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
    LOG.plan_info.plan = plan;

    if (!plan) {
      LOG.error = "Product not mapped";
      console.log(JSON.stringify(LOG, null, 2));
      return new Response("Ignored unmapped product", { status: 200 });
    }

    // 4. Expiry
    let expiry = null;
    if (plan.days) {
      const now = new Date();
      now.setDate(now.getDate() + plan.days);
      expiry = now.toISOString(); // FIX: Proper format
    }

    LOG.plan_info.expiry = expiry;

    // 5. SUPABASE update (use correct table name)
    const updatePayload = {
      is_pro_user: true,
      pro_expiry: expiry,
      purchase_plan: plan.plan,
    };

    LOG.supabase_payload = updatePayload;

    const { error } = await supabase
      .from("user") // FIX: table name should be lowercase
      .update(updatePayload)
      .eq("id", userId);

    LOG.supabase_response = { error };

    if (error) {
      LOG.error = "Supabase update error";
      console.log(JSON.stringify(LOG, null, 2));
      return new Response("Database error", { status: 500 });
    }

    LOG.step = "SUCCESS";
    console.log(JSON.stringify(LOG, null, 2));

    return new Response("User upgraded to Pro", { status: 200 });
  } catch (err) {
    const LOG = { fatal_error: err.message, stack: err.stack };
    console.log(JSON.stringify(LOG, null, 2));
    return new Response("Server error", { status: 500 });
  }
}
