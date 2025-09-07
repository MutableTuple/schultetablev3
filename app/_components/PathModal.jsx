"use client";
import React, { useEffect, useRef } from "react";

export default function PathModal({ isOpen, onClose, pathData }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !pathData.length) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw path
    ctx.strokeStyle = "rgba(255,255,255,0.8)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pathData[0].x, pathData[0].y);
    pathData.forEach((p) => ctx.lineTo(p.x, p.y));
    ctx.stroke();
  }, [isOpen, pathData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <div className="bg-base-100 rounded-lg shadow-lg p-4 max-w-2xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 btn btn-sm btn-error"
        >
          ✕
        </button>
        <h2 className="text-lg font-semibold mb-3">Your Mouse Path</h2>
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="border border-gray-500 w-full h-[500px]"
        />
      </div>
    </div>
  );
}
