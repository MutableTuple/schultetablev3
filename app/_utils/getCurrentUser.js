"use server";

import { createUserClient } from "../_lib/supabaseServer";
import { fetchUserFromDB } from "../_lib/data-service";

export async function getCurrentUser() {
  const supabase = await createUserClient(); // MUST await

  if (!supabase) {
    return { user: null, error: "Supabase not initialized" };
  }

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return { user: null, error: "Not logged in" };
  }

  const fetched_user = await fetchUserFromDB(data.user.id);

  return { user: fetched_user, error: null };
}
