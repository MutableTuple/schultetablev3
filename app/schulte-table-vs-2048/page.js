import VsCompetitorPage from "@/app/_components/VsCompetitor/VsCompetitorPage";
import { ALTERNATIVES } from "@/app/_data/alternatives";

const data = ALTERNATIVES.find((a) => a.slug === "2048");

export const metadata = {
  title: "Schulte Table vs 2048: Which Number Game Trains Your Brain?",
  description: "Schulte Table vs 2048 compared — casual number-merging strategy vs. structured attention training. See which fits your goals.",
  keywords: [
    "schulte table vs 2048",
    "2048 game alternative",
    "2048 vs schulte table",
    "number puzzle brain training",
    "2048 focus training"
  ],
  alternates: {
    canonical: "https://schultetable.com/schulte-table-vs-2048",
  },
  openGraph: {
    title: "Schulte Table vs 2048: Which Number Game Trains Your Brain?",
    description: "Schulte Table vs 2048 compared — casual number-merging strategy vs. structured attention training. See which fits your goals.",
    url: "https://schultetable.com/schulte-table-vs-2048",
    type: "article",
  },
};

export default function Page() {
  return <VsCompetitorPage data={data} />;
}
