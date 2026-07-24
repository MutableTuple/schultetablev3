import React from "react";
import { getCurrentUser } from "@/app/_utils/getCurrentUser";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AdvancedBrainReportPage from "@/app/_components/Profile/AdvancedBrainReportPage";
import NotLoggedInProfile from "@/app/_components/NotLoggedInProfile";

export default async function page() {
  const { user, error } = await getCurrentUser();

  if (!user) {
    return <NotLoggedInProfile />;
  }

  return (
    <div>
      <AdvancedBrainReportPage user={user} />
    </div>
  );
}
