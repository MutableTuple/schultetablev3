import VsCompetitorPage from "@/app/_components/VsCompetitor/VsCompetitorPage";
import { ALTERNATIVES } from "@/app/_data/alternatives";

const data = ALTERNATIVES.find((a) => a.slug === "rubiks-cube");

export const metadata = {
  title: "Schulte Table vs Rubik's Cube: Spatial Skill or Visual Attention?",
  description: "Schulte Table vs Rubik's Cube compared for spatial reasoning, muscle memory, and focus training. See which suits your goals.",
  keywords: [
    "schulte table vs rubiks cube",
    "rubiks cube alternative",
    "rubiks cube vs schulte table",
    "rubiks cube brain training",
    "spatial reasoning vs attention training"
  ],
  alternates: {
    canonical: "https://schultetable.com/schulte-table-vs-rubiks-cube",
  },
  openGraph: {
    title: "Schulte Table vs Rubik's Cube: Spatial Skill or Visual Attention?",
    description: "Schulte Table vs Rubik's Cube compared for spatial reasoning, muscle memory, and focus training. See which suits your goals.",
    url: "https://schultetable.com/schulte-table-vs-rubiks-cube",
    type: "article",
  },
};

export default function Page() {
  return <VsCompetitorPage data={data} />;
}
