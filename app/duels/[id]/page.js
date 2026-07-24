import React from "react";
import { getCurrentUser } from "../../_utils/getCurrentUser";
import Navbar from "../../_components/Navbar";
import LiveDuelRoom from "../../_components/Duels/LiveDuelRoom";

export const metadata = {
  title: "Live Duel",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function Page({ params }) {
  const { id } = await params;
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <LiveDuelRoom user={user} duelId={id} />
    </div>
  );
}
