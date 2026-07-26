import VsCompetitorPage from "@/app/_components/VsCompetitor/VsCompetitorPage";
import { ALTERNATIVES } from "@/app/_data/alternatives";

const data = ALTERNATIVES.find((a) => a.slug === "iq-test");

export const metadata = {
  // absolute — bypasses the root layout's "%s | Schulte Table" template,
  // which would otherwise push these titles past ~60 chars.
  title: { absolute: "Schulte Table vs Online IQ Tests: Score or Train?" },
  description: "Compare Schulte Table and online IQ tests for measuring versus training cognitive ability. See which fits what you're actually trying to do.",
  keywords: [
    "schulte table vs iq test",
    "iq test alternative",
    "iq test vs schulte table",
    "online iq test brain training",
    "cognitive training vs iq score"
  ],
  alternates: {
    canonical: "https://www.schultetable.com/schulte-table-vs-iq-test",
  },
  openGraph: {
    title: "Schulte Table vs Online IQ Tests: Score or Train?",
    description: "Compare Schulte Table and online IQ tests for measuring versus training cognitive ability. See which fits what you're actually trying to do.",
    url: "https://www.schultetable.com/schulte-table-vs-iq-test",
    type: "article",
  },
};

export default function Page() {
  return <VsCompetitorPage data={data} />;
}
