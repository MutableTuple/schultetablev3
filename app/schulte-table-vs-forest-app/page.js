import VsCompetitorPage from "@/app/_components/VsCompetitor/VsCompetitorPage";
import { ALTERNATIVES } from "@/app/_data/alternatives";

const data = ALTERNATIVES.find((a) => a.slug === "forest-app");

export const metadata = {
  title: "Schulte Table vs Forest App: Blocking Distractions or Training Focus?",
  description: "Compare Schulte Table and the Forest app for staying focused. See the difference between blocking distractions and actively training attention.",
  keywords: [
    "schulte table vs forest app",
    "forest app alternative",
    "forest app vs schulte table",
    "focus app comparison",
    "phone distraction app vs brain training"
  ],
  alternates: {
    canonical: "https://schultetable.com/schulte-table-vs-forest-app",
  },
  openGraph: {
    title: "Schulte Table vs Forest App: Blocking Distractions or Training Focus?",
    description: "Compare Schulte Table and the Forest app for staying focused. See the difference between blocking distractions and actively training attention.",
    url: "https://schultetable.com/schulte-table-vs-forest-app",
    type: "article",
  },
};

export default function Page() {
  return <VsCompetitorPage data={data} />;
}
