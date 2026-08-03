import VsCompetitorPage from "@/app/_components/VsCompetitor/VsCompetitorPage";
import { ALTERNATIVES } from "@/app/_data/alternatives";

const data = ALTERNATIVES.find((a) => a.slug === "2048");

export const metadata = {
  // absolute — bypasses the root layout's "%s | Schulte Table" template,
  // which would otherwise push these titles past ~60 chars.
  title: { absolute: "Schulte Table vs 2048: Which Number Game Trains Your Brain?" },
  description: "Schulte Table vs 2048 compared — casual number-merging strategy vs. structured attention training. See which fits your goals.",
  keywords: [
    "schulte table vs 2048",
    "2048 game alternative",
    "2048 vs schulte table",
    "number puzzle brain training",
    "2048 focus training"
  ],
  alternates: {
    canonical: "https://www.schultetable.com/schulte-table-vs-2048",
  },
  openGraph: {
    title: "Schulte Table vs 2048: Which Number Game Trains Your Brain?",
    description: "Schulte Table vs 2048 compared — casual number-merging strategy vs. structured attention training. See which fits your goals.",
    url: "https://www.schultetable.com/schulte-table-vs-2048",
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
