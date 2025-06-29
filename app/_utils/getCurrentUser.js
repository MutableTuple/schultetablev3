"use server";
import { getSession } from "../_lib/auth";
import { fetchUserFromDB } from "../_lib/data-service";

export async function getCurrentUser() {
  const session = await getSession();
  const user_id = session?.user?.value
    ? JSON.parse(session.user.value)?.identities?.[0]?.id
    : null;
  if (!user_id) {
    return { error: "User not found. Please log in.", user: null };
  }
  const fetched_user = await fetchUserFromDB(user_id);
  if (!fetched_user) {
    return { error: "No user data available.", user: null };
  }
  return { user: fetched_user, error: null };
}
