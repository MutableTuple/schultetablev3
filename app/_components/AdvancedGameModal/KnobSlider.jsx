export default function KnobSlider({ label, min, max, value }) {
  const safeMin = Number(min) || 0;
  const safeMax = Number(max) || 1;
  const safeVal = Math.min(Math.max(Number(value), safeMin), safeMax);

  // Percentage position for knob
  const pct = ((safeVal - safeMin) / (safeMax - safeMin)) * 100;

  // Dynamic knob color
  const color =
    pct < 33 ? "bg-green-500" : pct < 66 ? "bg-yellow-500" : "bg-red-500";

  return (
    <div className="w-full mb-6">
      {/* Title */}
      <div className="flex justify-between text-xs mb-1 opacity-80">
        <span>{label}</span>
      </div>

      {/* Slider Track */}
      <div className="relative h-3 bg-base-300 rounded-full">
        {/* Tooltip */}
        <div
          className="
            absolute px-2 py-0.5 text-xs text-white rounded-md shadow 
            bg-neutral-900 transition-all duration-300
          "
          style={{ left: `calc(${pct}% - 16px)`, top: "-28px" }}
        >
          {safeVal} ms
        </div>

        {/* Knob */}
        <div
          className={`
            absolute w-4 h-4 rounded-full border-2 border-white shadow 
            cursor-pointer transition-all duration-500 ${color}
          `}
          style={{ left: `calc(${pct}% - 8px)`, top: "-3px" }}
        ></div>
      </div>

      {/* Min / Max labels */}
      <div className="flex justify-between text-xs opacity-60 mt-1">
        <span>{safeMin} ms</span>
        <span>{safeMax} ms</span>
      </div>
    </div>
  );
}
