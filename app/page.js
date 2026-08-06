// app/page.js
import { getCurrentUser } from "./_utils/getCurrentUser";
import { supabase } from "./_lib/supabase";
import { isProUser } from "./_utils/isPro";
import HomeMain from "./_components/HomeMain";
import ClientShell from "./_components/ClientShell";
import FloatingMonthlyReportBtnNudge from "./_components/FloatingMontlyReportBtnNudge";
import FloatingBrainTestNudge from "./_components/FloatingBrainTestNudge";
import ProgressRail from "./_components/Home/ProgressRail";
import AffiliateStrip from "./_components/Home/AffiliateStrip";
import HomeSeoSection from "./_components/Home/HomeSeoSection";
import { HOME_FAQS, HOME_STEPS } from "./_data/homeContent";

export const metadata = {
  title: {
    absolute: "Play Schulte Table Online Free – No App, No Sign-Up",
  },
  description:
    "Free online Schulte Table trainer — no app to download. Choose your grid size (3×3 to 9×9), play instantly, and track your speed as you improve.",
  alternates: {
    canonical: "https://www.schultetable.com/",
  },
  openGraph: {
    title: "Play Schulte Table Online Free",
    description:
      "Train your brain with the classic Schulte Table exercise. Improve attention span and reading speed while having fun.",
    url: "https://www.schultetable.com/",
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
  const pro = isProUser(user);

  // Real play count instead of a hardcoded placeholder — a cheap head-count
  // query, not a fabricated number in structured data.
  const { count: totalGamesPlayed } = await supabase
    .from("UniversalGameStats")
    .select("*", { count: "exact", head: true });

  const gameJsonLd = {
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
      userInteractionCount: totalGamesPlayed ?? 0,
    },
    publisher: {
      "@type": "Organization",
      name: "Schulte Table",
      url: "https://www.schultetable.com/",
    },
  };

  // FAQPage + HowTo, both generated from the same data the page renders below
  // the game. Google requires structured data to match visible content, so
  // these are derived from HOME_FAQS / HOME_STEPS rather than written twice.
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOME_FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to play a Schulte Table",
    description:
      "Fix your gaze on the centre of the grid and find the numbers in ascending order using peripheral vision rather than scanning.",
    totalTime: "PT2M",
    step: HOME_STEPS.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.detail,
      url: `https://www.schultetable.com/#step-${i + 1}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gameJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />

      <HomeMain
        user={user}
        error={error}
        header={
          /* The h1 was `text-xs`, which is a real ranking liability on the
             page that holds the site's head term — a 12px heading reads as
             boilerplate to both users and Google. It's now sized properly on
             desktop and still compact on mobile, where vertical space above
             the board is genuinely scarce. */
          <header className="text-center max-w-3xl mx-auto mb-2">
            <h1 className="text-sm sm:text-lg font-bold leading-tight text-foreground">
              Schulte Table — Free Online Focus &amp; Speed-Reading Trainer
            </h1>
            <p className="mt-1.5 text-[11px] sm:text-xs text-muted-foreground">
              Fix your eyes on the centre, find the numbers in order, beat your
              time. Grid sizes 3×3 to 9×9 — no app, no sign-up.
            </p>
          </header>
        }
      />

      {/* Everything below sits under the full-height game area, so the first
          viewport is unchanged for someone who came here purely to play. */}
      <ProgressRail user={user} isPro={pro} />
      <AffiliateStrip isPro={pro} />
      <HomeSeoSection />

      <ClientShell user={user} />
      <FloatingBrainTestNudge />
      <FloatingMonthlyReportBtnNudge />
    </>
  );
}
