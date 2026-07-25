import VsCompetitorPage from "@/app/_components/VsCompetitor/VsCompetitorPage";
import { ALTERNATIVES } from "@/app/_data/alternatives";

const data = ALTERNATIVES.find((a) => a.slug === "tetris");

export const metadata = {
  title: "Schulte Table vs Tetris: Reflexes or Focused Attention Training?",
  description: "Schulte Table vs Tetris compared for reaction speed, spatial reasoning, and focus. Find out which brain exercise suits your goals.",
  keywords: [
    "schulte table vs tetris",
    "tetris alternative",
    "tetris vs schulte table",
    "tetris brain training",
    "reaction time vs attention training"
  ],
  alternates: {
    canonical: "https://schultetable.com/schulte-table-vs-tetris",
  },
  openGraph: {
    title: "Schulte Table vs Tetris: Reflexes or Focused Attention Training?",
    description: "Schulte Table vs Tetris compared for reaction speed, spatial reasoning, and focus. Find out which brain exercise suits your goals.",
    url: "https://schultetable.com/schulte-table-vs-tetris",
    type: "article",
  },
};

export default function Page() {
  return <VsCompetitorPage data={data} />;
}
