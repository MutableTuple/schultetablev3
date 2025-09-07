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
    "Play Schulte Table Online – Reboot Your Brain in 30s with Interactive Grids & Progress Tracking",
  description:
    "Train your brain with Schulte Tables - a scientifically proven method to enhance peripheral vision, reading speed, and concentration. Free online tool for visual perception training and cognitive development with progress tracking.",
  keywords: [
    "schulte table",
    "舒尔特方格",
    "schulte",
    "brain training",
    "speed reading",
    "cognitive training",
    "focus improvement",
    "concentration exercises",
    "peripheral vision",
    "mental training",
    "attention training",
    "eye movement training",
    "schulte table game",
    "schulte table colour",
    "schulte-table",
    "tablica schulte",
    "schulte tables",
    "brain game schulte table",
    "schulte table brain game",
    "table schulte",
    "shulte table",
    "schultetable",
    "schulte game",
    "tabla de schulte",
    "schule table",
    "schutle table",
    "the schulte table",
    "schulte table brain exercise",
    "schulte grid",
    "schult table",
    "shuttle table brain game",
    "schulte table games",
    "shult table",
    "tablas schulte",
    "tabelul lui schulte",
    "mesa de schulte",
    "tablas de schulte",
    "schultz tables",
    "brain exercise schulte table",
  ],
  alternates: {
    canonical: "https://www.schultetable.com/",
  },
  openGraph: {
    title: "Play Schulte Table Online | Boost Brain Focus & Vision",
    description:
      "Train your brain with the classic Schulte Table exercise. Improve attention span and reading speed while having fun.",
    url: "https://www.schultetable.com/",
    siteName: "Play Schulte Table Online",
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

const jsonLd = [
  // Organization
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Schulte Table",
    url: "https://www.schultetable.com/",
    logo: "https://hflzumrbjzkzofgzeyao.supabase.co/storage/v1/object/public/media//Logo.png",
    sameAs: [
      "https://www.facebook.com/schultetable",
      "https://twitter.com/schultetable",
      "https://www.linkedin.com/company/schultetable",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-123-456-7890",
      contactType: "Customer Support",
      email: "support@schultetable.com",
    },
  },

  // WebSite
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Schulte Table",
    url: "https://www.schultetable.com/",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.schultetable.com/?s={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  },

  // Game
  {
    "@context": "https://schema.org",
    "@type": "Game",
    name: "Schulte Table Online",
    url: "https://www.schultetable.com/",
    description:
      "Train your brain with Schulte Table. Improve focus, speed reading, and peripheral vision. Free online brain game.",
    image:
      "https://hflzumrbjzkzofgzeyao.supabase.co/storage/v1/object/public/media//Logo.png",
    audience: {
      "@type": "Audience",
      audienceType: "Everyone",
    },
    interactionStatistic: {
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/PlayAction",
      userInteractionCount: 1000000, // Optional: approximate plays/users
    },
    publisher: {
      "@type": "Organization",
      name: "Schulte Table",
      url: "https://www.schultetable.com/",
    },
  },
];

export default async function Home() {
  const { user, error } = await getCurrentUser();
  const mission = await getMissionByID("7113a0c2-ce6d-4896-8260-9ca759bb512c");

  return (
    <>
      {/* ✅ SEO-friendly screen reader tags */}
      <h1 className="sr-only">
        Schulte Table – Train Focus, Reading Speed & Peripheral Vision
      </h1>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
