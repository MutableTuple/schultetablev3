import VsCompetitorPage from "@/app/_components/VsCompetitor/VsCompetitorPage";
import { ALTERNATIVES } from "@/app/_data/alternatives";

const data = ALTERNATIVES.find((a) => a.slug === "peak");

export const metadata = {
  title: "Schulte Table vs Peak: Which Brain Training App Wins?",
  description: "Compare Schulte Table and Peak brain training app for focus, memory, and cognitive skills. See which fits your training goals and budget.",
  keywords: [
    "schulte table vs peak",
    "peak brain training alternative",
    "peak app vs schulte table",
    "brain training app comparison",
    "free brain training vs peak"
  ],
  alternates: {
    canonical: "https://schultetable.com/schulte-table-vs-peak",
  },
  openGraph: {
    title: "Schulte Table vs Peak: Which Brain Training App Wins?",
    description: "Compare Schulte Table and Peak brain training app for focus, memory, and cognitive skills. See which fits your training goals and budget.",
    url: "https://schultetable.com/schulte-table-vs-peak",
    type: "article",
  },
};

export default function Page() {
  return <VsCompetitorPage data={data} />;
}
