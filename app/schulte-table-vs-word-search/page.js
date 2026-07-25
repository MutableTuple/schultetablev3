import VsCompetitorPage from "@/app/_components/VsCompetitor/VsCompetitorPage";
import { ALTERNATIVES } from "@/app/_data/alternatives";

const data = ALTERNATIVES.find((a) => a.slug === "word-search");

export const metadata = {
  title: "Schulte Table vs Word Search: Which Visual Puzzle Is Better?",
  description: "Schulte Table vs Word Search puzzles compared for visual scanning, attention, and speed. See which is the better focus exercise.",
  keywords: [
    "schulte table vs word search",
    "word search alternative",
    "word search vs schulte table",
    "word search brain training",
    "visual scanning puzzle"
  ],
  alternates: {
    canonical: "https://schultetable.com/schulte-table-vs-word-search",
  },
  openGraph: {
    title: "Schulte Table vs Word Search: Which Visual Puzzle Is Better?",
    description: "Schulte Table vs Word Search puzzles compared for visual scanning, attention, and speed. See which is the better focus exercise.",
    url: "https://schultetable.com/schulte-table-vs-word-search",
    type: "article",
  },
};

export default function Page() {
  return <VsCompetitorPage data={data} />;
}
