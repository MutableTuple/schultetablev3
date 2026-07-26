import VsCompetitorPage from "@/app/_components/VsCompetitor/VsCompetitorPage";
import { ALTERNATIVES } from "@/app/_data/alternatives";

const data = ALTERNATIVES.find((a) => a.slug === "brainhq");

export const metadata = {
  // absolute — bypasses the root layout's "%s | Schulte Table" template,
  // which would otherwise push these titles past ~60 chars.
  title: { absolute: "Schulte Table vs BrainHQ: Which Focus Trainer Wins?" },
  description: "Schulte Table vs BrainHQ compared for scientific backing, cost, and focus training. Find out which brain exercise is right for you.",
  keywords: [
    "schulte table vs brainhq",
    "brainhq alternative",
    "brainhq vs schulte table",
    "science-based brain training",
    "free brain training vs brainhq"
  ],
  alternates: {
    canonical: "https://www.schultetable.com/schulte-table-vs-brainhq",
  },
  openGraph: {
    title: "Schulte Table vs BrainHQ: Which Focus Trainer Wins?",
    description: "Schulte Table vs BrainHQ compared for scientific backing, cost, and focus training. Find out which brain exercise is right for you.",
    url: "https://www.schultetable.com/schulte-table-vs-brainhq",
    type: "article",
  },
};

export default function Page() {
  return <VsCompetitorPage data={data} />;
}
