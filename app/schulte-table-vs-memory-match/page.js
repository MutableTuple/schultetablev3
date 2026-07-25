import VsCompetitorPage from "@/app/_components/VsCompetitor/VsCompetitorPage";
import { ALTERNATIVES } from "@/app/_data/alternatives";

const data = ALTERNATIVES.find((a) => a.slug === "memory-match");

export const metadata = {
  title: "Schulte Table vs Memory Match: Memory or Attention Training?",
  description: "Schulte Table vs Memory Match (Concentration) compared for short-term memory and visual attention. Find out which trains your brain better.",
  keywords: [
    "schulte table vs memory match",
    "concentration game alternative",
    "memory match vs schulte table",
    "memory game brain training",
    "short-term memory vs attention training"
  ],
  alternates: {
    canonical: "https://schultetable.com/schulte-table-vs-memory-match",
  },
  openGraph: {
    title: "Schulte Table vs Memory Match: Memory or Attention Training?",
    description: "Schulte Table vs Memory Match (Concentration) compared for short-term memory and visual attention. Find out which trains your brain better.",
    url: "https://schultetable.com/schulte-table-vs-memory-match",
    type: "article",
  },
};

export default function Page() {
  return <VsCompetitorPage data={data} />;
}
