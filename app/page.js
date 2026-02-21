// app/page.js
import { getCurrentUser } from "./_utils/getCurrentUser";
import HomeMain from "./_components/HomeMain";
import ClientShell from "./_components/ClientShell";
import StickyGetProBtn from "./_components/StickyGetProBtn";

// ✅ SEO metadata export
export const metadata = {
  title:
    "Play Schulte Table Online – Free Brain Training Game for Focus & Mental Speed",

  description:
    "Train your brain with our free online Schulte Table game. Improve speed reading, focus, and peripheral vision with a scientifically proven method. Start your training and track your progress today!",
  keywords: [
    "schulte table",
    "schulte table online",
    "brain training game",
    "schultetable",
    "speed reading",
    "concentration exercises",
    "peripheral vision training",
  ],
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
      userInteractionCount: 45000,
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

  return (
    <>
      {/* JSON-LD structured data */}
      {/* <header className="absolute top-6 left-1/2 -translate-x-1/2 text-center px-4 w-full max-w-3xl pointer-events-none ">
        <h1 className="text-xs font-bold leading-tight">
          Schulte Table Online — Train Your Brain for Focus & Mental Speed
        </h1>
        <p className="mt-2 text-xs text-gray-400">
          The Schulte Table is a scientifically used brain training exercise
          that improves attention, peripheral vision, and mental processing
          speed. Practice free online and track your progress over time.
        </p>
      </header> */}

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
      <ClientShell user={user} />
      {/* <StickyGetProBtn user={user} /> */}
    </>
  );
}
