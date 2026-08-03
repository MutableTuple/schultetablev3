import VsCompetitorPage from "@/app/_components/VsCompetitor/VsCompetitorPage";
import { ALTERNATIVES } from "@/app/_data/alternatives";

const data = ALTERNATIVES.find((a) => a.slug === "memory-match");

export const metadata = {
  // absolute — bypasses the root layout's "%s | Schulte Table" template,
  // which would otherwise push these titles past ~60 chars.
  title: { absolute: "Schulte Table vs Memory Match: Memory or Attention Training?" },
  description: "Schulte Table vs Memory Match (Concentration) compared for short-term memory and visual attention. Find out which trains your brain better.",
  keywords: [
    "schulte table vs memory match",
    "concentration game alternative",
    "memory match vs schulte table",
    "memory game brain training",
    "short-term memory vs attention training"
  ],
  alternates: {
    canonical: "https://www.schultetable.com/schulte-table-vs-memory-match",
  },
  openGraph: {
    title: "Schulte Table vs Memory Match: Memory or Attention Training?",
    description: "Schulte Table vs Memory Match (Concentration) compared for short-term memory and visual attention. Find out which trains your brain better.",
    url: "https://www.schultetable.com/schulte-table-vs-memory-match",
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
