import Image from "next/image";
import HomeMain from "./_components/HomeMain";
import { getCurrentUser } from "./_utils/getCurrentUser";
import WhatsNewModal from "./_components/WhatsNewModal";
import GameLoginPrompt from "./_components/Modals/GameLoginPrompt.jsx";
import ThemeChangerHotkey from "./_components/ThemeChangerHotkey";
import { getMissionByID } from "./_lib/data-service";
import FloatingMissionPill from "./_components/FloatingMissionPill";
import MissionButton from "./_components/MissionButton";

export default async function Home() {
  const { user, error } = await getCurrentUser();
  const mission = await getMissionByID("7113a0c2-ce6d-4896-8260-9ca759bb512c");
  return (
    <>
      <WhatsNewModal isLoggedIn={!!user} />
      <GameLoginPrompt />
      <HomeMain user={user} error={error} />
      <ThemeChangerHotkey user={user} />
      {/* <FloatingMissionPill mission={mission[0]} /> */}
      <MissionButton />
    </>
  );
}
