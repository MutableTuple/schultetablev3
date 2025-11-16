import { supabase } from "@/app/_lib/supabase";

export async function POST(req) {
  const body = await req.json();

  // Only handle order_created events
  if (body.meta?.event_name !== "order_created") {
    return new Response("Ignored", { status: 200 });
  }

  const email = body.data?.attributes?.user_email;
  const userId = body.meta?.custom_data?.user_id;

  // Get Product ID purchased
  const productId =
    body.data?.attributes?.first_order_item?.product_id ||
    body.data?.attributes?.order_items?.[0]?.product_id;

  if (!userId || !email || !productId) {
    console.error("Missing fields", { userId, email, productId });
    return new Response("Missing required data", { status: 400 });
  }

  // Map product ID to plan details
  const PLAN_MAP = {
    "470240d2-a5ee-4def-92c0-394c2ecf0579": {
      plan: "india_30days",
      days: 30,
    },
    "1d34e5e2-5140-4a77-b8ce-72f5615aea97": {
      plan: "india_lifetime",
      days: null,
    },
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
    console.log("Not a PRO product. Ignored.");
    return new Response("Ignored", { status: 200 });
  }

  // Calculate expiry date
  let expiry = null;
  if (plan.days) {
    expiry = new Date();
    expiry.setDate(expiry.getDate() + plan.days);
  }

  // Update user
  const { error } = await supabase
    .from("User")
    .update({
      is_pro_user: true,
      pro_expiry: expiry, // null for lifetime
      purchase_plan: plan.plan,
    })
    .eq("id", userId);

  if (error) {
    console.error("Supabase update error:", error.message);
    return new Response("Database error", { status: 500 });
  }

  return new Response("User upgraded to Pro", { status: 200 });
}
