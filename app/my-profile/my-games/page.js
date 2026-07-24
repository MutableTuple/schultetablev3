import React from "react";
import GamelistPage from "@/app/_components/Profile/GamelistPage";
import { getCurrentUser } from "@/app/_utils/getCurrentUser";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import NotLoggedInProfile from "@/app/_components/NotLoggedInProfile";

export default async function page() {
  const { user } = await getCurrentUser();

  if (!user) {
    return <NotLoggedInProfile />;
  }

  return (
    <div>
      <GamelistPage user={user} />
    </div>
  );
}
