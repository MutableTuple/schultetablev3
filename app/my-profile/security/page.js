import SecurityPage from "@/app/_components/Profile/SecurityPage";
import React from "react";
import { getCurrentUser } from "@/app/_utils/getCurrentUser";
import NotLoggedInProfile from "@/app/_components/NotLoggedInProfile";

export default async function page() {
  const { user, error } = await getCurrentUser();

  if (!user) {
    return <NotLoggedInProfile />;
  }

  return (
    <div>
      <SecurityPage />
    </div>
  );
}
