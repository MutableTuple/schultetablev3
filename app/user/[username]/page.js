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
  const { username } = await params;
  const user = await getUserByUsername(username);

  if (!user) {
    return {
      title: { absolute: "User Not Found | Schulte Table" },
      robots: { index: false, follow: false },
    };
  }

  const displayName = user.name || user.username;
  const description = `${displayName}'s Schulte Table profile — score: ${
    user.score ?? 0
  }. See their brain training stats and progress.`;
  const url = `https://www.schultetable.com/user/${user.username}`;

  return {
    title: { absolute: `${displayName} (@${user.username}) | Schulte Table` },
    description,
    alternates: {
      canonical: url,
    },
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      title: `${displayName} (@${user.username})`,
      description,
      url,
      siteName: "Schulte Table",
      type: "profile",
      images: [
        {
          url: user.image || "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${displayName}'s Schulte Table profile`,
        },
      ],
    },
  };
}

/**
 * Profile Page
 */
export default async function Page({ params }) {
  const { username } = await params;
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