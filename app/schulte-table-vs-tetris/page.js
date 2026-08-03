import VsCompetitorPage from "@/app/_components/VsCompetitor/VsCompetitorPage";
import { ALTERNATIVES } from "@/app/_data/alternatives";

const data = ALTERNATIVES.find((a) => a.slug === "tetris");

export const metadata = {
  // absolute — bypasses the root layout's "%s | Schulte Table" template,
  // which would otherwise push these titles past ~60 chars.
  title: { absolute: "Schulte Table vs Tetris: Reflexes or Focus Training?" },
  description: "Schulte Table vs Tetris compared for reaction speed, spatial reasoning, and focus. Find out which brain exercise suits your goals.",
  keywords: [
    "schulte table vs tetris",
    "tetris alternative",
    "tetris vs schulte table",
    "tetris brain training",
    "reaction time vs attention training"
  ],
  alternates: {
    canonical: "https://www.schultetable.com/schulte-table-vs-tetris",
  },
  openGraph: {
    title: "Schulte Table vs Tetris: Reflexes or Focus Training?",
    description: "Schulte Table vs Tetris compared for reaction speed, spatial reasoning, and focus. Find out which brain exercise suits your goals.",
    url: "https://www.schultetable.com/schulte-table-vs-tetris",
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
