// components/ReportPreviewPreview.jsx
import React from "react";

export default function ReportPreviewPreview() {
  const FakeValue = ({ width = "40px" }) => (
    <span
      className="blur-[4px] opacity-70 select-none inline-block"
      style={{ width }}
    >
      ••••
    </span>
  );

  return (
    <div className="relative p-4 bg-base-100 rounded-xl border border-base-300 space-y-6 text-left select-none overflow-hidden">
      {/* CONTENT */}
      <div className="space-y-6 pb-24">
        {/* HEADER */}
        <div>
          <h2 className="text-lg font-bold">
            Your Cognitive Performance Report
          </h2>
          <p className="text-xs opacity-60 -mt-1">
            Summary based on your recent gameplay.
          </p>
        </div>

        {/* SECTION: Reaction Time */}
        <div className="bg-base-300 p-3 rounded-xl border border-base-200 space-y-2">
          <h3 className="font-semibold text-sm mb-1">Reaction Time</h3>
          <PreviewRow label="Avg Reaction Time" value="235 ms" />
          <PreviewRow label="Fastest (Best)" value={<FakeValue />} />
          <PreviewRow label="Slowest (Worst)" value={<FakeValue />} />
          <PreviewRow label="Speed Trend" value={<FakeValue />} />
        </div>

        {/* SECTION: Consistency */}
        <div className="bg-base-300 p-3 rounded-xl border border-base-200 space-y-2">
          <h3 className="font-semibold text-sm mb-1">Consistency</h3>
          <PreviewRow label="Avg Consistency" value={<FakeValue />} />
          <PreviewRow label="Global Percentile" value={<FakeValue />} />
          <PreviewRow label="Consistency Trend" value={<FakeValue />} />
        </div>

        {/* INSIGHT */}
        <div className="bg-base-300 p-3 rounded-xl border border-base-200">
          <h3 className="font-semibold mb-1">Overall Insight</h3>
          <p className="blur-[4px] opacity-80 text-sm select-none">
            Unlock to view personalized mental performance guidance…
          </p>
        </div>

        {/* GAME TABLE PREVIEW */}
        <div className="bg-base-300 p-3 rounded-xl border border-base-200">
          <h3 className="font-semibold mb-2">Game-by-Game Breakdown</h3>
          <div className="text-xs opacity-70">Example preview only</div>

          <div className="overflow-x-auto mt-2">
            <table className="table table-xs">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Avg RT</th>
                  <th>Fastest</th>
                  <th>Consistency</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3].map((i) => (
                  <tr key={i}>
                    <td>{i}</td>
                    <td>—</td>
                    <td>
                      <FakeValue />
                    </td>
                    <td>
                      <FakeValue />
                    </td>
                    <td>
                      <FakeValue />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ⬇️ BOTTOM FADE SHADOW (this is the tease) */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-base-200 via-base-200/60 to-transparent pointer-events-none"></div>
    </div>
  );
}

function PreviewRow({ label, value }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span>{label}</span>
      <span className="badge badge-neutral px-3 py-2 font-semibold">
        {value}
      </span>
    </div>
  );
}
