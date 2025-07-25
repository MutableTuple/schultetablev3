// app/page.js
import Image from "next/image";
import { getCurrentUser } from "./_utils/getCurrentUser";
import { getMissionByID } from "./_lib/data-service";
import HomeMain from "./_components/HomeMain";
import ClientShell from "./_components/ClientShell";

// import WhatsNewModal from "./_components/WhatsNewModal";
// import GameLoginPrompt from "./_components/Modals/GameLoginPrompt.jsx";
// import ThemeChangerHotkey from "./_components/ThemeChangerHotkey";
// import MissionButton from "./_components/MissionButton";
// import ShowProLoggedInModals from "./_components/Modals/ShowProLoggedInModals";
// import ShinyGoProButton from "./_components/ShinyGoProButton";
// import ChatBox from "./_components/Chat/ChatBox";

// ✅ SEO metadata export
export const metadata = {
  title:
    "Play Schulte Table Online | Reboot your brain in just 30 seconds for Free!",
  description:
    "Train your brain with Schulte Table. Improve your focus, speed reading, and visual attention. Free, fun, and scientifically backed brain exercise!",
  keywords: [
    "Schulte Table",
    "brain training",
    "mental focus",
    "speed reading",
    "vision training",
    "focus game",
    "brain game",
  ],
  alternates: {
    canonical: "https://www.schultetable.com/",
  },
  openGraph: {
    title: "Play Schulte Table Online | Boost Brain Focus & Vision",
    description:
      "Train your brain with the classic Schulte Table exercise. Improve attention span and reading speed while having fun.",
    url: "https://www.schultetable.com/",
    siteName: "SchulteTable.com",
    images: [
      {
        url: "https://hflzumrbjzkzofgzeyao.supabase.co/storage/v1/object/public/media//Logo.png", // Replace with your actual image
        width: 1200,
        height: 630,
        alt: "Schulte Table - Brain Training",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Play Schulte Table Online | Boost Brain Focus & Vision",
    description:
      "Free online Schulte Table game to improve your focus and speed reading skills.",
    images: [
      "https://hflzumrbjzkzofgzeyao.supabase.co/storage/v1/object/public/media//Logo.png",
    ], // Replace with actual image
  },
};

export default async function Home() {
  const { user, error } = await getCurrentUser();
  const mission = await getMissionByID("7113a0c2-ce6d-4896-8260-9ca759bb512c");

  return (
    <>
      {/* ✅ SEO-friendly screen reader tags */}
      <h1 className="sr-only">
        Schulte Table – Train Focus, Reading Speed & Peripheral Vision
      </h1>
      <p className="sr-only">
        Improve your brain performance with Schulte Tables. Scientifically
        proven method to enhance visual perception, attention span, and speed
        reading abilities.
      </p>
      <HomeMain user={user} error={error} />
      {/* <ChatBox user={user} />
      <WhatsNewModal isLoggedIn={!!user} />
      <GameLoginPrompt />
      <ThemeChangerHotkey user={user} />
      <MissionButton />
      <ShowProLoggedInModals user={user} />
      <ShinyGoProButton
        isProUser={Array.isArray(user) && user[0]?.is_pro_user}
      /> */}
      <ClientShell user={user} />
    </>
  );
}
