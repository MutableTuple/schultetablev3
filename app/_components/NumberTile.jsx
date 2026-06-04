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

    onClick?.();
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

        rounded-none

        border
        border-base-300

        bg-base-100

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
              hover:bg-base-200
            `
        }

        ${pressed ? "scale-[0.96] bg-base-200" : ""}

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
          border
          border-base-300/60
        "
      />

      {/* LABEL */}
      <span
        className={`
          relative
          z-10
          font-bold
          text-base-content
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
          transition-opacity
          duration-150

          ${pressed ? "opacity-100 bg-primary/5" : "opacity-0"}
        `}
      />
    </button>
  );
}

export default memo(NumberTile);
