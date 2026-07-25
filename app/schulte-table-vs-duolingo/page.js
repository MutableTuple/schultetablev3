import VsCompetitorPage from "@/app/_components/VsCompetitor/VsCompetitorPage";
import { ALTERNATIVES } from "@/app/_data/alternatives";

const data = ALTERNATIVES.find((a) => a.slug === "duolingo");

export const metadata = {
  title: "Schulte Table vs Duolingo: Which Daily Habit Is Right for You?",
  description: "Compare Schulte Table and Duolingo for daily habit-building, focus, and language learning. See which fits your goals — or use both.",
  keywords: [
    "schulte table vs duolingo",
    "duolingo alternative",
    "duolingo vs schulte table",
    "daily brain habit app",
    "language learning vs focus training"
  ],
  alternates: {
    canonical: "https://schultetable.com/schulte-table-vs-duolingo",
  },
  openGraph: {
    title: "Schulte Table vs Duolingo: Which Daily Habit Is Right for You?",
    description: "Compare Schulte Table and Duolingo for daily habit-building, focus, and language learning. See which fits your goals — or use both.",
    url: "https://schultetable.com/schulte-table-vs-duolingo",
    type: "article",
  },
};

export default function Page() {
  return <VsCompetitorPage data={data} />;
}
