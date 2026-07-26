import VsCompetitorPage from "@/app/_components/VsCompetitor/VsCompetitorPage";
import { ALTERNATIVES } from "@/app/_data/alternatives";

const data = ALTERNATIVES.find((a) => a.slug === "trivia-crack");

export const metadata = {
  // absolute — bypasses the root layout's "%s | Schulte Table" template,
  // which would otherwise push these titles past ~60 chars.
  title: { absolute: "Schulte Table vs Trivia Crack: Trivia or Focus Drill?" },
  description: "Compare Schulte Table and Trivia Crack for knowledge, social competition, and attention training. See which fits your brain-training goals.",
  keywords: [
    "schulte table vs trivia crack",
    "trivia crack alternative",
    "trivia crack vs schulte table",
    "multiplayer trivia game",
    "solo attention training"
  ],
  alternates: {
    canonical: "https://www.schultetable.com/schulte-table-vs-trivia-crack",
  },
  openGraph: {
    title: "Schulte Table vs Trivia Crack: Trivia or Focus Drill?",
    description: "Compare Schulte Table and Trivia Crack for knowledge, social competition, and attention training. See which fits your brain-training goals.",
    url: "https://www.schultetable.com/schulte-table-vs-trivia-crack",
    type: "article",
  },
};

export default function Page() {
  return <VsCompetitorPage data={data} />;
}
