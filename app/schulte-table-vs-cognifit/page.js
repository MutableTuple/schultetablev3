import VsCompetitorPage from "@/app/_components/VsCompetitor/VsCompetitorPage";
import { ALTERNATIVES } from "@/app/_data/alternatives";

const data = ALTERNATIVES.find((a) => a.slug === "cognifit");

export const metadata = {
  // absolute — bypasses the root layout's "%s | Schulte Table" template,
  // which would otherwise push these titles past ~60 chars.
  title: { absolute: "Schulte Table vs CogniFit: Test or Train Your Brain?" },
  description: "Compare Schulte Table and CogniFit for cognitive assessment, training, and everyday focus. See which fits your goals and budget.",
  keywords: [
    "schulte table vs cognifit",
    "cognifit alternative",
    "cognifit vs schulte table",
    "cognitive assessment vs attention training",
    "free brain training vs cognifit"
  ],
  alternates: {
    canonical: "https://www.schultetable.com/schulte-table-vs-cognifit",
  },
  openGraph: {
    title: "Schulte Table vs CogniFit: Test or Train Your Brain?",
    description: "Compare Schulte Table and CogniFit for cognitive assessment, training, and everyday focus. See which fits your goals and budget.",
    url: "https://www.schultetable.com/schulte-table-vs-cognifit",
    type: "article",
  },
};

export default function Page() {
  return <VsCompetitorPage data={data} />;
}
