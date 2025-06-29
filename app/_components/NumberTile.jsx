import React, { useState, useRef } from "react";

export default function NumberTile({ num, onClick, disabled }) {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isClicked, setIsClicked] = useState(false);
  const tileRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = tileRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const handleClick = () => {
    if (!disabled && onClick) onClick();
  };

  return (
    <div
      ref={tileRef}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseDown={() => setIsClicked(true)}
      onMouseUp={() => setIsClicked(false)}
      onMouseLeave={() => {
        setIsClicked(false);
        setMousePosition({ x: 50, y: 50 });
      }}
      className={`
        relative aspect-square bg-base-100 border
        ${
          disabled
            ? "cursor-not-allowed opacity-40"
            : "cursor-pointer hover:border-primary/50"
        }
        border-primary/40 transition-all duration-200
        overflow-hidden select-none flex items-center justify-center min-h-[80px]
      `}
    >
      {/* Radial light on hover */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-100"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
            rgba(255,255,255,0.12) 0%, 
            rgba(255,255,255,0.08) 25%,
            rgba(255,255,255,0.04) 50%,
            rgba(255,255,255,0.02) 75%,
            transparent 100%)`,
        }}
      />

      {/* Click glow */}
      <div
        className={`absolute inset-0 pointer-events-none transition-all duration-200 ${
          isClicked ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
            hsl(var(--p)/0.5) 0%, 
            hsl(var(--p)/0.25) 30%, 
            transparent 100%)`,
          boxShadow: isClicked
            ? `0 0 25px hsl(var(--p)/0.8), inset 0 0 15px hsl(var(--p)/0.4)`
            : "none",
        }}
      />

      <div className="relative z-10 font-bold text-base-content text-center break-all">
        {(() => {
          const label = typeof num === "object" ? num.expr : String(num);
          return (
            <span
              className={`
          ${label.length <= 2 ? "text-2xl" : ""}
          ${label.length === 3 ? "text-xl" : ""}
          ${label.length === 4 ? "text-lg" : ""}
          ${label.length >= 5 ? "text-base" : ""}
        `}
            >
              {label}
            </span>
          );
        })()}
      </div>
    </div>
  );
}
