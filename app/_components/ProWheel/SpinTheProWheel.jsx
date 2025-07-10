"use client";
import React, { useEffect, useState } from "react";
import { getCurrentUser } from "@/app/_utils/getCurrentUser";
import NotLoggedInModal from "../Modals/NotLoggedInModal";
import SpinWheelModal from "./SpinWheelModal"; // the one we built earlier

export default function SpinTheProWheel() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setChecking(false);
    }

    fetchUser();
  }, []);

  if (checking) return null; // loading state or spinner

  return (
    <>{!user ? <NotLoggedInModal /> : <SpinWheelModal userId={user.id} />}</>
  );
}
