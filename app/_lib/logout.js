"use server";

import { createUserClient } from "./supabaseServer";

export async function logout() {
  const supabase = createUserClient();

  await supabase.auth.signOut();

  return { success: true };
}
