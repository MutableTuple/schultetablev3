import UserProfile from "@/app/_components/Profile/UserProfile";
import { getUserByUsername } from "@/app/_lib/data-service";

export async function generateMetadata({ params }) {
  const { username } = params;
  const user = await getUserByUsername(username);

  return {
    title: user[0] ? `${user[0].username}` : `User not found`,
  };
}

export default async function Page({ params }) {
  const { username } = params;
  const user = await getUserByUsername(username);

  if (!user[0]) {
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
