// /lib/logoutClient.js
import { supabase } from "./supabase";

export async function logoutClient() {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
}
