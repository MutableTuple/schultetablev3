import VsCompetitorPage from "@/app/_components/VsCompetitor/VsCompetitorPage";
import { ALTERNATIVES } from "@/app/_data/alternatives";

const data = ALTERNATIVES.find((a) => a.slug === "chess");

export const metadata = {
  // absolute — bypasses the root layout's "%s | Schulte Table" template,
  // which would otherwise push these titles past ~60 chars.
  title: { absolute: "Schulte Table vs Chess: Strategy Training or Focus Training?" },
  description: "Schulte Table vs Chess.com compared for focus, strategic thinking, and mental training. See which is right for your cognitive goals.",
  keywords: [
    "schulte table vs chess",
    "chess.com alternative",
    "chess vs schulte table",
    "chess focus training",
    "strategy game vs attention training"
  ],
  alternates: {
    canonical: "https://www.schultetable.com/schulte-table-vs-chess",
  },
  openGraph: {
    title: "Schulte Table vs Chess: Strategy Training or Focus Training?",
    description: "Schulte Table vs Chess.com compared for focus, strategic thinking, and mental training. See which is right for your cognitive goals.",
    url: "https://www.schultetable.com/schulte-table-vs-chess",
    type: "article",
  },
};

export default function Page() {
  return <VsCompetitorPage data={data} />;
}
