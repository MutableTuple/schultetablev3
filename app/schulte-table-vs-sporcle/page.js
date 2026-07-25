import VsCompetitorPage from "@/app/_components/VsCompetitor/VsCompetitorPage";
import { ALTERNATIVES } from "@/app/_data/alternatives";

const data = ALTERNATIVES.find((a) => a.slug === "sporcle");

export const metadata = {
  title: "Schulte Table vs Sporcle: Trivia Recall or Focus Training?",
  description: "Schulte Table vs Sporcle compared for knowledge recall, quizzing, and attention training. Find the right brain exercise for your goals.",
  keywords: [
    "schulte table vs sporcle",
    "sporcle alternative",
    "sporcle vs schulte table",
    "trivia game brain training",
    "knowledge recall vs attention training"
  ],
  alternates: {
    canonical: "https://schultetable.com/schulte-table-vs-sporcle",
  },
  openGraph: {
    title: "Schulte Table vs Sporcle: Trivia Recall or Focus Training?",
    description: "Schulte Table vs Sporcle compared for knowledge recall, quizzing, and attention training. Find the right brain exercise for your goals.",
    url: "https://schultetable.com/schulte-table-vs-sporcle",
    type: "article",
  },
};

export default function Page() {
  return <VsCompetitorPage data={data} />;
}
