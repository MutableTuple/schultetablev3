import VsCompetitorPage from "@/app/_components/VsCompetitor/VsCompetitorPage";
import { ALTERNATIVES } from "@/app/_data/alternatives";

const data = ALTERNATIVES.find((a) => a.slug === "duolingo");

export const metadata = {
  // absolute — bypasses the root layout's "%s | Schulte Table" template,
  // which would otherwise push these titles past ~60 chars.
  title: { absolute: "Schulte Table vs Duolingo: Which Daily Habit Wins?" },
  description: "Compare Schulte Table and Duolingo for daily habit-building, focus, and language learning. See which fits your goals — or use both.",
  keywords: [
    "schulte table vs duolingo",
    "duolingo alternative",
    "duolingo vs schulte table",
    "daily brain habit app",
    "language learning vs focus training"
  ],
  alternates: {
    canonical: "https://www.schultetable.com/schulte-table-vs-duolingo",
  },
  openGraph: {
    title: "Schulte Table vs Duolingo: Which Daily Habit Wins?",
    description: "Compare Schulte Table and Duolingo for daily habit-building, focus, and language learning. See which fits your goals — or use both.",
    url: "https://www.schultetable.com/schulte-table-vs-duolingo",
    siteName: "Schulte Table",
    type: "article",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Schulte Table Training Interface",
      },
    ],
  },
};

export default function Page() {
  return <VsCompetitorPage data={data} />;
}
