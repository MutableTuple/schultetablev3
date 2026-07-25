import VsCompetitorPage from "@/app/_components/VsCompetitor/VsCompetitorPage";
import { ALTERNATIVES } from "@/app/_data/alternatives";

const data = ALTERNATIVES.find((a) => a.slug === "crossword");

export const metadata = {
  title: "Schulte Table vs Crossword Puzzles: Which Trains Your Brain Better?",
  description: "Compare Schulte Table and crossword puzzles for memory, vocabulary, focus, and speed. See which brain exercise matches your goals.",
  keywords: [
    "schulte table vs crossword",
    "crossword puzzle alternative",
    "crossword vs schulte table",
    "nyt crossword brain training",
    "word recall vs attention training"
  ],
  alternates: {
    canonical: "https://schultetable.com/schulte-table-vs-crossword",
  },
  openGraph: {
    title: "Schulte Table vs Crossword Puzzles: Which Trains Your Brain Better?",
    description: "Compare Schulte Table and crossword puzzles for memory, vocabulary, focus, and speed. See which brain exercise matches your goals.",
    url: "https://schultetable.com/schulte-table-vs-crossword",
    type: "article",
  },
};

export default function Page() {
  return <VsCompetitorPage data={data} />;
}
