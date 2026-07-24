"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Section({ title, valueLabel, isOpen, onToggle, children }) {
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between py-3"
      >
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          {title}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="text-xs font-semibold capitalize">{valueLabel}</span>
          <ChevronDown
            size={14}
            className={cn(
              "text-muted-foreground transition-transform duration-200",
              isOpen && "rotate-180",
            )}
          />
        </span>
      </button>
      {isOpen && <div className="pb-3">{children}</div>}
    </div>
  );
}

export default function GridAndDifficultySelector({
  gridSize,
  setGridSize,
  difficulty,
  setDifficulty,
  gameStarted,
  mode,
  setMode,
}) {
  const [isLargeScreen, setIsLargeScreen] = useState(true);
  const [openMode, setOpenMode] = useState(false);
  const [openGrid, setOpenGrid] = useState(false);
  const [openDifficulty, setOpenDifficulty] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const onChange = (e) => setIsLargeScreen(e.matches);
    setIsLargeScreen(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const trackGA = useCallback((name, value) => {
    if (window?.gtag) window.gtag("event", name, { value, ts: Date.now() });
  }, []);

  const gridOptions = useMemo(() => {
    const base = isLargeScreen ? [3, 4, 5, 6, 7, 8] : [3, 4, 5];
    if (mode === "alphabet") return [3, 4, 5];
    if (mode === "maths") return base.filter((g) => g <= 7);
    return base;
  }, [isLargeScreen, mode]);

  const handleSelect = (setter, gaName, value) => {
    setter(value);
    trackGA(gaName, value);
    document.activeElement?.blur();
  };

  const btnClass =
    "min-h-[48px] px-2 py-2 text-sm font-semibold capitalize rounded-none border-border transition-transform duration-200 hover:scale-[1.03] active:scale-95";

  if (gameStarted) return null;

  return (
    <div className="w-full">
      {/* GAME MODE */}
      <Section
        title="Game Mode"
        valueLabel={mode}
        isOpen={openMode}
        onToggle={() => setOpenMode((o) => !o)}
      >
        <div className="grid grid-cols-3 gap-2">
          {[
            "number",
            "word",
            ...(gridSize <= 5 ? ["alphabet"] : []),
            "emoji",
            "maths",
          ].map((m) => (
            <Button
              key={m}
              type="button"
              variant={mode === m ? "default" : "outline"}
              onClick={() => handleSelect(setMode, "mode_change", m)}
              className={btnClass}
            >
              {m}
            </Button>
          ))}
        </div>
      </Section>

      {/* GRID SIZE */}
      <Section
        title="Grid Size"
        valueLabel={`${gridSize}×${gridSize}`}
        isOpen={openGrid}
        onToggle={() => setOpenGrid((o) => !o)}
      >
        <div className="grid grid-cols-3 gap-2">
          {gridOptions.map((size) => (
            <Button
              key={size}
              type="button"
              variant={gridSize === size ? "default" : "outline"}
              onClick={() => handleSelect(setGridSize, "grid_change", size)}
              className={btnClass}
            >
              {size}×{size}
            </Button>
          ))}
        </div>
      </Section>

      {/* DIFFICULTY */}
      <Section
        title="Difficulty"
        valueLabel={difficulty}
        isOpen={openDifficulty}
        onToggle={() => setOpenDifficulty((o) => !o)}
      >
        <div className="grid grid-cols-2 gap-2">
          {["Easy", "Medium", "Hard", "Extreme", "Impossible"].map((diff) => (
            <Button
              key={diff}
              type="button"
              variant={difficulty === diff ? "default" : "outline"}
              onClick={() =>
                handleSelect(setDifficulty, "difficulty_change", diff)
              }
              className={btnClass}
            >
              {diff}
            </Button>
          ))}
        </div>
      </Section>
    </div>
  );
}
