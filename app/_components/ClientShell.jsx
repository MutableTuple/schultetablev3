// app/_components/ClientShell.jsx
"use client";
// import GameLoginPrompt from "./Modals/GameLoginPrompt.jsx";

import dynamic from "next/dynamic";
// Lazy-loaded client-side components

const GameLoginPrompt = dynamic(() => import("./Modals/GameLoginPrompt.jsx"), {
  ssr: false,
});

const ShowProLoggedInModals = dynamic(
  () => import("./Modals/ShowProLoggedInModals"),
  { ssr: false }
);
const ShinyGoProButton = dynamic(() => import("./ShinyGoProButton"), {
  ssr: false,
});

export default function ClientShell({ user }) {
  return (
    <>
      <GameLoginPrompt />
      <ShowProLoggedInModals user={user} />
      <ShinyGoProButton
        isProUser={Array.isArray(user) && user[0]?.is_pro_user}
      />
    </>
  );
}
