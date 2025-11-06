"use client";
import React, { useEffect, useState } from "react";
import { MdDownload } from "react-icons/md";

export default function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();

    const result = await deferredPrompt.userChoice;

    if (result.outcome === "accepted") {
      if (typeof window.gtag === "function") {
        window.gtag("event", "pwa_install", {
          event_category: "engagement",
          event_label: "Schulte Table PWA",
          value: 1,
        });
      }
    }

    setShowButton(false);
    setDeferredPrompt(null);
  };

  if (!showButton) return null;

  return (
    <div className="fixed top-64 mt-3.5 left-4 z-30">
      <div className="tooltip tooltip-right" data-tip="Install App">
        <button
          onClick={handleInstallClick}
          className="btn btn-warning btn-circle btn-sm shadow-md hover:scale-105 transition-all"
        >
          <MdDownload size={20} />
        </button>
      </div>
    </div>
  );
}
