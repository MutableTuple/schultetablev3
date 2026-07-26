import VsCompetitorPage from "@/app/_components/VsCompetitor/VsCompetitorPage";
import { ALTERNATIVES } from "@/app/_data/alternatives";

const data = ALTERNATIVES.find((a) => a.slug === "rubiks-cube");

export const metadata = {
  // absolute — bypasses the root layout's "%s | Schulte Table" template,
  // which would otherwise push these titles past ~60 chars.
  title: { absolute: "Schulte Table vs Rubik's Cube: Which Trains Focus?" },
  description: "Schulte Table vs Rubik's Cube compared for spatial reasoning, muscle memory, and focus training. See which suits your goals.",
  keywords: [
    "schulte table vs rubiks cube",
    "rubiks cube alternative",
    "rubiks cube vs schulte table",
    "rubiks cube brain training",
    "spatial reasoning vs attention training"
  ],
  alternates: {
    canonical: "https://www.schultetable.com/schulte-table-vs-rubiks-cube",
  },
  openGraph: {
    title: "Schulte Table vs Rubik's Cube: Which Trains Focus?",
    description: "Schulte Table vs Rubik's Cube compared for spatial reasoning, muscle memory, and focus training. See which suits your goals.",
    url: "https://www.schultetable.com/schulte-table-vs-rubiks-cube",
    type: "article",
  },
};

export default function Page() {
  return <VsCompetitorPage data={data} />;
}
