import VsCompetitorPage from "@/app/_components/VsCompetitor/VsCompetitorPage";
import { ALTERNATIVES } from "@/app/_data/alternatives";

const data = ALTERNATIVES.find((a) => a.slug === "sudoku");

export const metadata = {
  // absolute — bypasses the root layout's "%s | Schulte Table" template,
  // which would otherwise push these titles past ~60 chars.
  title: { absolute: "Schulte Table vs Sudoku: Which Trains Your Brain Better?" },
  description: "Compare Schulte Table and Sudoku for focus, attention, logic, and speed. See which brain exercise fits your goals — or use both.",
  keywords: [
    "schulte table vs sudoku",
    "sudoku alternative",
    "sudoku vs schulte table",
    "brain games like sudoku",
    "attention training vs logic puzzles",
    "sudoku brain training"
  ],
  alternates: {
    canonical: "https://www.schultetable.com/schulte-table-vs-sudoku",
  },
  openGraph: {
    title: "Schulte Table vs Sudoku: Which Trains Your Brain Better?",
    description: "Compare Schulte Table and Sudoku for focus, attention, logic, and speed. See which brain exercise fits your goals — or use both.",
    url: "https://www.schultetable.com/schulte-table-vs-sudoku",
    siteName: "Schulte Table",
    type: "article",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Schulte Table Training Interface",
      },
    ],
  },
};

export default function Page() {
  return <VsCompetitorPage data={data} />;
}
