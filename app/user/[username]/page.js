import UserProfile from "@/app/_components/Profile/UserProfile";
import { supabase } from "@/app/_lib/supabase";

/**
 * Direct DB fetch by username
 */
async function getUserByUsername(username) {
  try {
    const { data, error } = await supabase
      .from("User")
      .select("*")
      .eq("username", username)
      .single();

    if (error || !data) {
      console.error("User fetch error:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("getUserByUsername error:", err);
    return null;
  }
}

/**
 * SEO Metadata
 */
export async function generateMetadata({ params }) {
  const username = params.username;
  const user = await getUserByUsername(username);

  return {
    title: user ? `${user.username}` : "User not found",
  };
}

/**
 * Profile Page
 */
export default async function Page({ params }) {
  const username = params.username;
  const user = await getUserByUsername(username);

  if (!user) {
    return (
      <div className="text-center mt-10 text-error text-lg font-semibold">
        User {username} not found.
      </div>
    );
  }

  return (
    <div>
      <UserProfile user={user} />
    </div>
  );
}