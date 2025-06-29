import Image from "next/image";
import HomeMain from "./_components/HomeMain";
import { getCurrentUser } from "./_utils/getCurrentUser";
import WhatsNewModal from "./_components/WhatsNewModal";

export default async function Home() {
  const { user, error } = await getCurrentUser();

  return (
    <>
      <WhatsNewModal />
      <HomeMain user={user} error={error} />;
    </>
  );
}
