// app/page.js
import { getCurrentUser } from "./_utils/getCurrentUser";
import { supabase } from "./_lib/supabase";
import HomeMain from "./_components/HomeMain";
import ClientShell from "./_components/ClientShell";
import FloatingMonthlyReportBtnNudge from "./_components/FloatingMontlyReportBtnNudge";

export const metadata = {
  title: {
    absolute: "Play Schulte Table Online Free – No App, No Sign-Up",
  },
  description:
    "Free online Schulte Table trainer — no app to download. Choose your grid size (3×3 to 9×9), play instantly, and track your speed as you improve.",
  alternates: {
    canonical: "https://schultetable.com/",
  },
  openGraph: {
    title: "Play Schulte Table Online Free",
    description:
      "Train your brain with the classic Schulte Table exercise. Improve attention span and reading speed while having fun.",
    url: "https://schultetable.com/",
    siteName: "Play Schulte Table Online",
    images: [
      {
        url: "https://hflzumrbjzkzofgzeyao.supabase.co/storage/v1/object/public/media//Logo.png",
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
    ],
  },
};

export default async function Home() {
  const { user, error } = await getCurrentUser();

  // Real play count instead of a hardcoded placeholder — a cheap head-count
  // query, not a fabricated number in structured data.
  const { count: totalGamesPlayed } = await supabase
    .from("UniversalGameStats")
    .select("*", { count: "exact", head: true });

  const gameJsonLd = {
    "@context": "https://schema.org",
    "@type": "Game",
    name: "Schulte Table Online",
    url: "https://schultetable.com/",
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
      userInteractionCount: totalGamesPlayed ?? 0,
    },
    publisher: {
      "@type": "Organization",
      name: "Schulte Table",
      url: "https://schultetable.com/",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gameJsonLd) }}
      />

      <HomeMain
        user={user}
        error={error}
        header={
          <header className="text-center max-w-3xl mx-auto mb-2">
            <h1 className="text-xs font-bold leading-tight text-foreground">
              Schulte Table Online — Train Your Brain for Focus & Mental Speed
            </h1>
            <p className="mt-2 text-xs text-muted-foreground">
              The Schulte Table is a scientifically used brain training exercise
              that improves attention, peripheral vision, and mental processing
              speed. Practice free online and track your progress over time.
            </p>
          </header>
        }
      />
      <ClientShell user={user} />
      <FloatingMonthlyReportBtnNudge />
    </>
  );
}
