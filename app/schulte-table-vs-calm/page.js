import VsCompetitorPage from "@/app/_components/VsCompetitor/VsCompetitorPage";
import { ALTERNATIVES } from "@/app/_data/alternatives";

const data = ALTERNATIVES.find((a) => a.slug === "calm");

export const metadata = {
  // absolute — bypasses the root layout's "%s | Schulte Table" template,
  // which would otherwise push these titles past ~60 chars.
  title: { absolute: "Schulte Table vs Calm: Relax App or Focus Trainer?" },
  description: "Compare Schulte Table and the Calm app for relaxation, sleep, and active focus training. See which fits your goals right now.",
  keywords: [
    "schulte table vs calm app",
    "calm app alternative",
    "calm vs schulte table",
    "relaxation app vs brain training",
    "sleep app vs attention training"
  ],
  alternates: {
    canonical: "https://www.schultetable.com/schulte-table-vs-calm",
  },
  openGraph: {
    title: "Schulte Table vs Calm: Relax App or Focus Trainer?",
    description: "Compare Schulte Table and the Calm app for relaxation, sleep, and active focus training. See which fits your goals right now.",
    url: "https://www.schultetable.com/schulte-table-vs-calm",
    type: "article",
  },
};

export default function Page() {
  return <VsCompetitorPage data={data} />;
}
