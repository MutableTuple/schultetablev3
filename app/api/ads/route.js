import { NextResponse } from "next/server";
import { createUserClient } from "@/app/_lib/supabaseServer";

export async function GET() {
  const supabaseServer = await createUserClient();

  const { data, error } = await supabaseServer
    .from("Ads")
    .select("*");

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}