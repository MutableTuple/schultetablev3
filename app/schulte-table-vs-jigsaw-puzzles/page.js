import VsCompetitorPage from "@/app/_components/VsCompetitor/VsCompetitorPage";
import { ALTERNATIVES } from "@/app/_data/alternatives";

const data = ALTERNATIVES.find((a) => a.slug === "jigsaw-puzzles");

export const metadata = {
  // absolute — bypasses the root layout's "%s | Schulte Table" template,
  // which would otherwise push these titles past ~60 chars.
  title: { absolute: "Schulte Table vs Jigsaw Puzzles: Relax or Train?" },
  description: "Compare Schulte Table and jigsaw puzzles for relaxation, pattern recognition, and focus training. See which fits your goals.",
  keywords: [
    "schulte table vs jigsaw puzzles",
    "jigsaw puzzle alternative",
    "jigsaw puzzle vs schulte table",
    "jigsaw puzzle brain benefits",
    "pattern matching vs attention training"
  ],
  alternates: {
    canonical: "https://www.schultetable.com/schulte-table-vs-jigsaw-puzzles",
  },
  openGraph: {
    title: "Schulte Table vs Jigsaw Puzzles: Relax or Train?",
    description: "Compare Schulte Table and jigsaw puzzles for relaxation, pattern recognition, and focus training. See which fits your goals.",
    url: "https://www.schultetable.com/schulte-table-vs-jigsaw-puzzles",
    type: "article",
  },
};

export default function Page() {
  return <VsCompetitorPage data={data} />;
}
