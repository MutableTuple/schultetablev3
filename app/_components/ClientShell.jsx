// app/_components/ClientShell.jsx
"use client";
// import GameLoginPrompt from "./Modals/GameLoginPrompt.jsx";

import dynamic from "next/dynamic";

const GameLoginPrompt = dynamic(() => import("./Modals/GameLoginPrompt.jsx"), {
  ssr: false,
});

const ShowProLoggedInModals = dynamic(
  () => import("./Modals/ShowProLoggedInModals"),
  { ssr: false }
);

export default function ClientShell({ user }) {
  return (
    <>
      <GameLoginPrompt />
      <ShowProLoggedInModals user={user} />
    </>
  );
}
