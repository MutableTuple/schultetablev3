import Image from "next/image";
import HomeMain from "./_components/HomeMain";
import { getCurrentUser } from "./_utils/getCurrentUser";
import WhatsNewModal from "./_components/WhatsNewModal";
import GameLoginPrompt from "./_components/Modals/GameLoginPrompt.jsx";

export default async function Home() {
  const { user, error } = await getCurrentUser();
  console.log("IS LOGGED ON", !!user);
  return (
    <>
      <WhatsNewModal isLoggedIn={!!user} />
      <GameLoginPrompt />
      <HomeMain user={user} error={error} />
    </>
  );
}
