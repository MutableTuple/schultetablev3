import VsCompetitorPage from "@/app/_components/VsCompetitor/VsCompetitorPage";
import { ALTERNATIVES } from "@/app/_data/alternatives";

const data = ALTERNATIVES.find((a) => a.slug === "solitaire");

export const metadata = {
  title: "Schulte Table vs Solitaire: Relaxing Card Game or Focus Trainer?",
  description: "Schulte Table vs Solitaire compared for relaxation, strategy, and attention training. See which brain exercise fits your daily habit.",
  keywords: [
    "schulte table vs solitaire",
    "solitaire alternative",
    "solitaire vs schulte table",
    "solitaire brain training",
    "card game vs attention exercise"
  ],
  alternates: {
    canonical: "https://schultetable.com/schulte-table-vs-solitaire",
  },
  openGraph: {
    title: "Schulte Table vs Solitaire: Relaxing Card Game or Focus Trainer?",
    description: "Schulte Table vs Solitaire compared for relaxation, strategy, and attention training. See which brain exercise fits your daily habit.",
    url: "https://schultetable.com/schulte-table-vs-solitaire",
    type: "article",
  },
};

export default function Page() {
  return <VsCompetitorPage data={data} />;
}
