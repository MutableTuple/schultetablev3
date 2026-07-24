import ProfilePage from "@/app/_components/Profile/ProfilePage";
import { getCurrentUser } from "@/app/_utils/getCurrentUser";
import Link from "next/link";
import React from "react";
import ProfileInformation from "../_components/Profile/ProfileInformation";
import { Button } from "@/components/ui/button";
import NotLoggedInProfile from "../_components/NotLoggedInProfile";

export const metadata = {
  title: "My Profile",
  description: "See your Schulte Table game stats and progress.",
  keywords: ["schulte table", "brain exercise", "profile"],
  alternates: {
    canonical: "https://schultetable.com/my-profile",
  },
};

export default async function Page() {
  const { user, error } = await getCurrentUser();

  if (!user) {
    return <NotLoggedInProfile />;
  }

  return <ProfileInformation user={user} />;
}
