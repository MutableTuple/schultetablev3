import VsCompetitorPage from "@/app/_components/VsCompetitor/VsCompetitorPage";
import { ALTERNATIVES } from "@/app/_data/alternatives";

const data = ALTERNATIVES.find((a) => a.slug === "happify");

export const metadata = {
  title: "Schulte Table vs Happify: Mood Training or Focus Training?",
  description: "Compare Schulte Table and Happify for mood, stress relief, and attention training. See which fits your mental wellness or focus goals.",
  keywords: [
    "schulte table vs happify",
    "happify alternative",
    "happify vs schulte table",
    "mood app vs brain training",
    "stress relief vs attention training"
  ],
  alternates: {
    canonical: "https://schultetable.com/schulte-table-vs-happify",
  },
  openGraph: {
    title: "Schulte Table vs Happify: Mood Training or Focus Training?",
    description: "Compare Schulte Table and Happify for mood, stress relief, and attention training. See which fits your mental wellness or focus goals.",
    url: "https://schultetable.com/schulte-table-vs-happify",
    type: "article",
  },
};

export default function Page() {
  return <VsCompetitorPage data={data} />;
}
