"use client";

import React, { useRef, useState, memo } from "react";

function NumberTile({ num, onClick, disabled }) {
  const tileRef = useRef(null);

  const [pressed, setPressed] = useState(false);

  const label = typeof num === "object" ? num.expr : String(num);

  const handlePressStart = () => {
    if (disabled) return;

    setPressed(true);

    if (navigator?.vibrate) {
      navigator.vibrate(8);
    }
  };

  const handlePressEnd = () => {
    if (disabled) return;

    setPressed(false);

    onClick?.(num);
  };

  const handleCancel = () => {
    setPressed(false);
  };

  return (
    <button
      ref={tileRef}
      disabled={disabled}
      onPointerDown={handlePressStart}
      onPointerUp={handlePressEnd}
      onPointerCancel={handleCancel}
      onPointerLeave={handleCancel}
      className={`
        relative
        aspect-square
        overflow-hidden

        rounded-2xl

        border
        border-border

        bg-card

        flex
        items-center
        justify-center

        transition-all
        duration-150

        active:scale-[0.96]
        w-full
        p-4

        ${
          disabled
            ? "cursor-not-allowed opacity-40"
            : `
              cursor-pointer
              hover:border-primary
              hover:bg-muted
            `
        }

        ${pressed ? "scale-[0.96] bg-muted" : ""}

        min-h-[58px]
        sm:min-h-[72px]
        md:min-h-[84px]
        lg:min-h-[96px]
      `}
      style={{
        userSelect: "none",
        WebkitUserSelect: "none",
        WebkitTouchCallout: "none",
        WebkitTapHighlightColor: "transparent",
        touchAction: "manipulation",
      }}
    >
      {/* INNER BORDER */}
      <div
        className="
          pointer-events-none
          absolute
          inset-[3px]
          rounded-xl
          border
          border-border/60
        "
      />

      {/* LABEL */}
      <span
        className={`
          relative
          z-10
          font-bold
          text-foreground
          text-center
          leading-none

          ${label.length <= 2 ? "text-2xl sm:text-3xl" : ""}

          ${label.length === 3 ? "text-xl sm:text-2xl" : ""}

          ${label.length === 4 ? "text-lg sm:text-xl" : ""}

          ${label.length >= 5 ? "text-sm sm:text-base" : ""}
        `}
        style={{
          pointerEvents: "none",
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
      >
        {label}
      </span>

      {/* ACTIVE PRESS OVERLAY */}
      <div
        className={`
          absolute
          inset-0
          rounded-2xl
          transition-opacity
          duration-150

          ${pressed ? "opacity-100 bg-primary/10" : "opacity-0"}
        `}
      />
    </button>
  );
}

export default memo(NumberTile);
