import VsCompetitorPage from "@/app/_components/VsCompetitor/VsCompetitorPage";
import { ALTERNATIVES } from "@/app/_data/alternatives";

const data = ALTERNATIVES.find((a) => a.slug === "wordle");

export const metadata = {
  // absolute — bypasses the root layout's "%s | Schulte Table" template,
  // which would otherwise push these titles past ~60 chars.
  title: { absolute: "Schulte Table vs Wordle: Daily Word Game or Focus Trainer?" },
  description: "Schulte Table vs Wordle compared — vocabulary and guessing vs visual attention and speed. Find out which fits your daily brain-training goals.",
  keywords: [
    "schulte table vs wordle",
    "wordle alternative",
    "wordle vs schulte table",
    "daily brain game like wordle",
    "vocabulary game vs attention training"
  ],
  alternates: {
    canonical: "https://www.schultetable.com/schulte-table-vs-wordle",
  },
  openGraph: {
    title: "Schulte Table vs Wordle: Daily Word Game or Focus Trainer?",
    description: "Schulte Table vs Wordle compared — vocabulary and guessing vs visual attention and speed. Find out which fits your daily brain-training goals.",
    url: "https://www.schultetable.com/schulte-table-vs-wordle",
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
