"use client";
import React, { useRef, useState, memo } from "react";

function NumberTile({ num, onClick, disabled }) {
  const tileRef = useRef(null);
  const [pressed, setPressed] = useState(false);
  const label = typeof num === "object" ? num.expr : String(num);

  const updateGlowPosition = (e) => {
    const rect = tileRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY;
    if (!clientX || !clientY) return;

    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    tileRef.current.style.setProperty("--mx", `${x}%`);
    tileRef.current.style.setProperty("--my", `${y}%`);
  };

  const handlePressStart = () => {
    if (disabled) return;
    setPressed(true);

    if (navigator?.vibrate) navigator.vibrate(8);

    tileRef.current.style.transform = "scale(0.93)";
    tileRef.current.classList.add("pressed-glow");
  };

  const handlePressEnd = () => {
    if (!pressed || disabled) return;
    setPressed(false);

    tileRef.current.style.transform = "scale(1)";
    tileRef.current.classList.remove("pressed-glow");
    onClick?.();
  };

  const handleCancel = () => {
    setPressed(false);
    tileRef.current.classList.remove("pressed-glow");
    tileRef.current.style.transform = "scale(1)";
    tileRef.current.style.setProperty("--mx", `50%`);
    tileRef.current.style.setProperty("--my", `50%`);
  };

  return (
    <div
      ref={tileRef}
      onPointerMove={updateGlowPosition}
      onPointerDown={handlePressStart}
      onPointerUp={handlePressEnd}
      onPointerCancel={handleCancel}
      onPointerLeave={handleCancel}
      className={`
        number-tile
        relative aspect-square bg-base-100 border
        ${disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer hover:border-primary/60"}
        border-primary/40 overflow-hidden
        flex items-center justify-center
        min-h-[58px] sm:min-h-[72px] md:min-h-[84px] lg:min-h-[96px]
        transition-transform duration-120 ease-out
        will-change-transform
      `}
      style={{
        "--mx": "50%",
        "--my": "50%",
        userSelect: "none",
        WebkitUserSelect: "none",
        WebkitTouchCallout: "none",
        WebkitTapHighlightColor: "transparent",
        touchAction: "manipulation",
        contain: "paint", // 🔥 prevents Chrome text searching
      }}
    >
      <div className="hover-glow absolute inset-0 pointer-events-none" />
      <div className="press-glow absolute inset-0 pointer-events-none" />

      {/* 🔥 RENDER LABEL USING CSS PSEUDO-ELEMENT SO CHROME CANNOT SEARCH IT */}
      <span
        className={`
          num-label
          font-bold text-base-content relative z-10 text-center px-1 break-words
          ${label.length <= 2 ? "text-xl sm:text-2xl" : ""}
          ${label.length === 3 ? "text-lg sm:text-xl" : ""}
          ${label.length === 4 ? "text-base sm:text-lg" : ""}
          ${label.length >= 5 ? "text-xs sm:text-sm" : ""}
        `}
        data-label={label}
        style={{
          pointerEvents: "none", // critical fix
          userSelect: "none",
          WebkitUserSelect: "none",
          WebkitTouchCallout: "none",
          WebkitTapHighlightColor: "transparent",
        }}
      ></span>
    </div>
  );
}

export default memo(NumberTile);
