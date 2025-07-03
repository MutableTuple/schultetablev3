"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IoMdClose } from "react-icons/io";

/**
 * ShineButton - A reusable button component with a shiny effect animation
 *
 * @param {Object} props - Component props
 * @param {string} props.href - Link destination (optional)
 * @param {string} props.text - Button text
 * @param {React.ReactNode} props.icon - Icon component to display before text
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onClick - Click handler (used when href is not provided)
 * @param {React.ReactNode} props.children - Children content (alternative to text prop)
 * @param {string} props.variant - Button variant (default, gold, etc.)
 */
const ShineButton = ({
  href,
  text,
  icon,
  className = "",
  onClick,
  children,
  variant,
  ...props
}) => {
  const [show, setShow] = useState(false);
  const storageKey = `shineButtonDismissed`;
  const timeKey = `shineButtonLastClosed`;
  const SIX_HOURS = 6 * 60 * 60 * 1000;

  useEffect(() => {
    const last = localStorage.getItem(timeKey);
    const now = new Date().getTime();
    if (!last || now - parseInt(last) > SIX_HOURS) {
      localStorage.removeItem(storageKey);
    }

    const isClosed = localStorage.getItem(storageKey);
    setShow(!isClosed);
  }, []);

  const handleClose = () => {
    setShow(false);
    localStorage.setItem(storageKey, "true");
    localStorage.setItem(timeKey, new Date().getTime().toString());
  };

  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-stone-50 text-black border border-stone-200";
      case "success":
        return "bg-green-600 text-white";
      case "danger":
        return "bg-red-600 text-white";
      case "login":
        return "bg-[#257c00] text-white";
      case "gold":
        return "bg-black text-yellow-400 border border-2 border-yellow-400/60";
      case "default":
      default:
        return "bg-black text-white";
    }
  };

  if (!show) return null;

  const buttonContent = (
    <button
      className={`relative flex items-center justify-between gap-2 px-3 py-1.5 rounded-md transition-all overflow-hidden hover:-translate-y-0.5 cursor-pointer ${getVariantClasses()} ${className}`}
      onClick={onClick}
      {...props}
    >
      {/* Shine effect */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 40%, rgba(255, 255, 255, 0.5) 50%, rgba(255,255,255,0) 60%, rgba(255,255,255,0) 100%)",
          backgroundSize: "200% 200%",
          animation: "coinShine 3s ease-in-out infinite",
        }}
      />
      {/* Content */}
      <div className="relative z-20 flex items-center gap-1 text-xs">
        {icon && icon}
        {text || children}
      </div>
      {/* Close Icon */}
      <div
        className="relative z-20 ml-2 text-sm hover:opacity-70"
        onClick={handleClose}
      >
        <IoMdClose />
      </div>

      <style jsx>{`
        @keyframes coinShine {
          0% {
            background-position: 200% 0;
          }
          50% {
            background-position: 0 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </button>
  );

  return href ? (
    <Link href={href} target="_blank" className="flex justify-center w-full">
      {buttonContent}
    </Link>
  ) : (
    <div className="flex justify-center w-full">{buttonContent}</div>
  );
};

export default ShineButton;
