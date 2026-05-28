// app/report/print/page.jsx
// Puppeteer navigates here — no nav, no chrome, just raw A4 pages

import CoverPage from "@/app/_components/PDFReport/CoverPage";
import FocusScore from "@/app/_components/PDFReport/FocusScore";
import RankCard from "@/app/_components/PDFReport/RankCard";
import PerformanceGraph from "@/app/_components/PDFReport/PerformanceGraph";
import Heatmap from "@/app/_components/PDFReport/Heatmap";
import StreakCard from "@/app/_components/PDFReport/StreakCard";
import ComparisonCard from "@/app/_components/PDFReport/ComparisonCard";

const PAGES = [
  CoverPage,
  FocusScore,
  RankCard,
  PerformanceGraph,
  Heatmap,
  StreakCard,
  ComparisonCard,
];

export default function PrintView() {
  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }

        @page {
          size: A4;
          margin: 0;
        }

        body {
          width: 794px;
          background: white;
        }

        .pdf-page {
          width: 794px;
          height: 1123px;
          overflow: hidden;
          position: relative;
          background: white;
          page-break-after: always;
          break-after: page;
        }

        /* last page — no trailing blank */
        .pdf-page:last-child {
          page-break-after: avoid;
          break-after: avoid;
        }
      `}</style>

      {PAGES.map((Page, i) => (
        <div key={i} className="pdf-page">
          <Page />
        </div>
      ))}
    </>
  );
}
