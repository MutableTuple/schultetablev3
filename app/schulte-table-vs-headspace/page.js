import VsCompetitorPage from "@/app/_components/VsCompetitor/VsCompetitorPage";
import { ALTERNATIVES } from "@/app/_data/alternatives";

const data = ALTERNATIVES.find((a) => a.slug === "headspace");

export const metadata = {
  title: "Schulte Table vs Headspace: Meditation or Active Focus Training?",
  description: "Schulte Table vs Headspace compared for calm, mindfulness, and active attention training. See which approach fits your focus goals.",
  keywords: [
    "schulte table vs headspace",
    "headspace alternative",
    "headspace vs schulte table",
    "meditation vs brain training",
    "mindfulness vs attention training"
  ],
  alternates: {
    canonical: "https://schultetable.com/schulte-table-vs-headspace",
  },
  openGraph: {
    title: "Schulte Table vs Headspace: Meditation or Active Focus Training?",
    description: "Schulte Table vs Headspace compared for calm, mindfulness, and active attention training. See which approach fits your focus goals.",
    url: "https://schultetable.com/schulte-table-vs-headspace",
    type: "article",
  },
};

export default function Page() {
  return <VsCompetitorPage data={data} />;
}
