import VsCompetitorPage from "@/app/_components/VsCompetitor/VsCompetitorPage";
import { ALTERNATIVES } from "@/app/_data/alternatives";

const data = ALTERNATIVES.find((a) => a.slug === "human-benchmark");

export const metadata = {
  // absolute — bypasses the root layout's "%s | Schulte Table" template,
  // which would otherwise push these titles past ~60 chars.
  title: { absolute: "Schulte Table vs Human Benchmark: Reflex or Focus?" },
  description: "Compare Schulte Table and Human Benchmark for reaction time testing versus visual attention training. See which fits your goals.",
  keywords: [
    "schulte table vs human benchmark",
    "human benchmark alternative",
    "human benchmark vs schulte table",
    "reaction time test vs attention training",
    "reflex test brain game"
  ],
  alternates: {
    canonical: "https://www.schultetable.com/schulte-table-vs-human-benchmark",
  },
  openGraph: {
    title: "Schulte Table vs Human Benchmark: Reflex or Focus?",
    description: "Compare Schulte Table and Human Benchmark for reaction time testing versus visual attention training. See which fits your goals.",
    url: "https://www.schultetable.com/schulte-table-vs-human-benchmark",
    type: "article",
  },
};

export default function Page() {
  return <VsCompetitorPage data={data} />;
}
