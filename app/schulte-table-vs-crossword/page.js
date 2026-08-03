import VsCompetitorPage from "@/app/_components/VsCompetitor/VsCompetitorPage";
import { ALTERNATIVES } from "@/app/_data/alternatives";

const data = ALTERNATIVES.find((a) => a.slug === "crossword");

export const metadata = {
  // absolute — bypasses the root layout's "%s | Schulte Table" template,
  // which would otherwise push these titles past ~60 chars.
  title: { absolute: "Schulte Table vs Crossword: Which Trains Focus Better?" },
  description: "Compare Schulte Table and crossword puzzles for memory, vocabulary, focus, and speed. See which brain exercise matches your goals.",
  keywords: [
    "schulte table vs crossword",
    "crossword puzzle alternative",
    "crossword vs schulte table",
    "nyt crossword brain training",
    "word recall vs attention training"
  ],
  alternates: {
    canonical: "https://www.schultetable.com/schulte-table-vs-crossword",
  },
  openGraph: {
    title: "Schulte Table vs Crossword: Which Trains Focus Better?",
    description: "Compare Schulte Table and crossword puzzles for memory, vocabulary, focus, and speed. See which brain exercise matches your goals.",
    url: "https://www.schultetable.com/schulte-table-vs-crossword",
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
