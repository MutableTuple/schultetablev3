"use client";
import React, { useEffect, useState } from "react";
import ProUpgradeModal from "../Modals/ProUpgradeModal";

export default function ShowProLoggedInModals({ user }) {
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const MILESTONES = [3, 9, 18, 27];

  useEffect(() => {
    if (!user || user.isPro) return;

    const sessionGames = parseInt(localStorage.getItem("session_games") || "0");
    setGamesPlayed(sessionGames);

    if (MILESTONES.includes(sessionGames)) {
      setShowModal(true);
    }
  }, [user]);

  return (
    <>{showModal && <ProUpgradeModal onClose={() => setShowModal(false)} />}</>
  );
}
