import VsCompetitorPage from "@/app/_components/VsCompetitor/VsCompetitorPage";
import { ALTERNATIVES } from "@/app/_data/alternatives";

const data = ALTERNATIVES.find((a) => a.slug === "brainhq");

export const metadata = {
  title: "Schulte Table vs BrainHQ: Paid Research-Based Training or Free Focus Drill?",
  description: "Schulte Table vs BrainHQ compared for scientific backing, cost, and focus training. Find out which brain exercise is right for you.",
  keywords: [
    "schulte table vs brainhq",
    "brainhq alternative",
    "brainhq vs schulte table",
    "science-based brain training",
    "free brain training vs brainhq"
  ],
  alternates: {
    canonical: "https://schultetable.com/schulte-table-vs-brainhq",
  },
  openGraph: {
    title: "Schulte Table vs BrainHQ: Paid Research-Based Training or Free Focus Drill?",
    description: "Schulte Table vs BrainHQ compared for scientific backing, cost, and focus training. Find out which brain exercise is right for you.",
    url: "https://schultetable.com/schulte-table-vs-brainhq",
    type: "article",
  },
};

export default function Page() {
  return <VsCompetitorPage data={data} />;
}
