import VsCompetitorPage from "@/app/_components/VsCompetitor/VsCompetitorPage";
import { ALTERNATIVES } from "@/app/_data/alternatives";

const data = ALTERNATIVES.find((a) => a.slug === "sporcle");

export const metadata = {
  // absolute — bypasses the root layout's "%s | Schulte Table" template,
  // which would otherwise push these titles past ~60 chars.
  title: { absolute: "Schulte Table vs Sporcle: Trivia Recall or Focus Training?" },
  description: "Schulte Table vs Sporcle compared for knowledge recall, quizzing, and attention training. Find the right brain exercise for your goals.",
  keywords: [
    "schulte table vs sporcle",
    "sporcle alternative",
    "sporcle vs schulte table",
    "trivia game brain training",
    "knowledge recall vs attention training"
  ],
  alternates: {
    canonical: "https://www.schultetable.com/schulte-table-vs-sporcle",
  },
  openGraph: {
    title: "Schulte Table vs Sporcle: Trivia Recall or Focus Training?",
    description: "Schulte Table vs Sporcle compared for knowledge recall, quizzing, and attention training. Find the right brain exercise for your goals.",
    url: "https://www.schultetable.com/schulte-table-vs-sporcle",
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
