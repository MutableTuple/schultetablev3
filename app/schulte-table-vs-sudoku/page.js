import VsCompetitorPage from "@/app/_components/VsCompetitor/VsCompetitorPage";
import { ALTERNATIVES } from "@/app/_data/alternatives";

const data = ALTERNATIVES.find((a) => a.slug === "sudoku");

export const metadata = {
  title: "Schulte Table vs Sudoku: Which Trains Your Brain Better?",
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
    canonical: "https://schultetable.com/schulte-table-vs-sudoku",
  },
  openGraph: {
    title: "Schulte Table vs Sudoku: Which Trains Your Brain Better?",
    description: "Compare Schulte Table and Sudoku for focus, attention, logic, and speed. See which brain exercise fits your goals — or use both.",
    url: "https://schultetable.com/schulte-table-vs-sudoku",
    type: "article",
  },
};

export default function Page() {
  return <VsCompetitorPage data={data} />;
}
