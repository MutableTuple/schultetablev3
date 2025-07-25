// app/_components/ClientShell.jsx
"use client";
// import GameLoginPrompt from "./Modals/GameLoginPrompt.jsx";

import dynamic from "next/dynamic";
import ChatBox from "./Chat/ChatBox";
// Lazy-loaded client-side components

const WhatsNewModal = dynamic(() => import("./WhatsNewModal"), { ssr: false });
const GameLoginPrompt = dynamic(() => import("./Modals/GameLoginPrompt.jsx"), {
  ssr: false,
});
const ThemeChangerHotkey = dynamic(() => import("./ThemeChangerHotkey"), {
  ssr: false,
});
const MissionButton = dynamic(() => import("./MissionButton"), { ssr: false });
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
      <ChatBox user={user} />
      <WhatsNewModal isLoggedIn={!!user} />
      <GameLoginPrompt />
      {/* <ThemeChangerHotkey user={user} /> */}
      <MissionButton />
      <ShowProLoggedInModals user={user} />
      <ShinyGoProButton
        isProUser={Array.isArray(user) && user[0]?.is_pro_user}
      />
    </>
  );
}
