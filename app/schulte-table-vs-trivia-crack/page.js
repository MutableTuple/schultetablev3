import VsCompetitorPage from "@/app/_components/VsCompetitor/VsCompetitorPage";
import { ALTERNATIVES } from "@/app/_data/alternatives";

const data = ALTERNATIVES.find((a) => a.slug === "trivia-crack");

export const metadata = {
  title: "Schulte Table vs Trivia Crack: Social Trivia or Solo Focus Drill?",
  description: "Compare Schulte Table and Trivia Crack for knowledge, social competition, and attention training. See which fits your brain-training goals.",
  keywords: [
    "schulte table vs trivia crack",
    "trivia crack alternative",
    "trivia crack vs schulte table",
    "multiplayer trivia game",
    "solo attention training"
  ],
  alternates: {
    canonical: "https://schultetable.com/schulte-table-vs-trivia-crack",
  },
  openGraph: {
    title: "Schulte Table vs Trivia Crack: Social Trivia or Solo Focus Drill?",
    description: "Compare Schulte Table and Trivia Crack for knowledge, social competition, and attention training. See which fits your brain-training goals.",
    url: "https://schultetable.com/schulte-table-vs-trivia-crack",
    type: "article",
  },
};

export default function Page() {
  return <VsCompetitorPage data={data} />;
}
