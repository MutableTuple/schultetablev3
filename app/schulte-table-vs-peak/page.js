import VsCompetitorPage from "@/app/_components/VsCompetitor/VsCompetitorPage";
import { ALTERNATIVES } from "@/app/_data/alternatives";

const data = ALTERNATIVES.find((a) => a.slug === "peak");

export const metadata = {
  // absolute — bypasses the root layout's "%s | Schulte Table" template,
  // which would otherwise push these titles past ~60 chars.
  title: { absolute: "Schulte Table vs Peak: Which Brain Training App Wins?" },
  description: "Compare Schulte Table and Peak brain training app for focus, memory, and cognitive skills. See which fits your training goals and budget.",
  keywords: [
    "schulte table vs peak",
    "peak brain training alternative",
    "peak app vs schulte table",
    "brain training app comparison",
    "free brain training vs peak"
  ],
  alternates: {
    canonical: "https://www.schultetable.com/schulte-table-vs-peak",
  },
  openGraph: {
    title: "Schulte Table vs Peak: Which Brain Training App Wins?",
    description: "Compare Schulte Table and Peak brain training app for focus, memory, and cognitive skills. See which fits your training goals and budget.",
    url: "https://www.schultetable.com/schulte-table-vs-peak",
    type: "article",
  },
};

export default function Page() {
  return <VsCompetitorPage data={data} />;
}
