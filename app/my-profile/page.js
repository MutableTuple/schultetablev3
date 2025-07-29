import ProfilePage from "@/app/_components/Profile/ProfilePage";
import { getCurrentUser } from "@/app/_utils/getCurrentUser";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "My Profile",
  description: "See your Schulte Table game stats and progress.",
  keywords: ["schulte table", "brain exercise", "profile"],

  alternates: {
    canonical: "https://www.schultetable.com/my-profile",
  },
};
export default async function Page() {
  const { user, error } = await getCurrentUser();

  if (!user) {
    return (
      <div className="h-96 flex items-center justify-center bg-base-100 text-center ">
        <div className="space-y-4 max-w-md">
          <h1 className="text-3xl font-bold text-error">
            You&apos;re not logged in
          </h1>
          <p className="text-base-content/70">
            Please log in to view your profile.
          </p>
          <Link href="/auth/login">
            <button className="btn btn-primary">Go to Login</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <ProfilePage user={user} />
    </div>
  );
}
