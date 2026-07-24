import AdvancedAnalyticsPage from "@/app/_components/Profile/AdvancedAnalyticsPage";
import React from "react";
import { getCurrentUser } from "@/app/_utils/getCurrentUser";
import NotLoggedInProfile from "@/app/_components/NotLoggedInProfile";

export default async function page() {
  const { user, error } = await getCurrentUser();

  if (!user) {
    return <NotLoggedInProfile />;
  }

  return <AdvancedAnalyticsPage user={user} />;
}
