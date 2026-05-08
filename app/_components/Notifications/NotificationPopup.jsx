import React, { useEffect, useRef, useState } from "react";

export default function NotificationPopup({
  show = false,
  message = "Notification",
  title = "",
  type = "success", // success error warning info neutral
  duration = 3000,
  onClose,

  // options
  showProgress = true,
  closable = true,
  position = "top", // top
  width = "min-w-[320px] max-w-md",
  icon = "",
}) {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  const closeTimeout = useRef(null);
  const progressInterval = useRef(null);

  useEffect(() => {
    if (!show) return;

    setVisible(true);
    setProgress(100);

    clearTimeout(closeTimeout.current);
    clearInterval(progressInterval.current);

    if (showProgress) {
      const started = Date.now();

      progressInterval.current = setInterval(() => {
        const elapsed = Date.now() - started;
        const left = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgress(left);
      }, 30);
    }

    closeTimeout.current = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(closeTimeout.current);
      clearInterval(progressInterval.current);
    };
  }, [show, duration, showProgress]);

  const handleClose = () => {
    clearTimeout(closeTimeout.current);
    clearInterval(progressInterval.current);

    setVisible(false);

    setTimeout(() => {
      onClose?.();
    }, 250);
  };

  const alertStyle = {
    success: "alert-success",
    error: "alert-error",
    warning: "alert-warning",
    info: "alert-info",
    neutral: "alert-neutral",
  };

  const progressStyle = {
    success: "progress-success",
    error: "progress-error",
    warning: "progress-warning",
    info: "progress-info",
    neutral: "progress-neutral",
  };

  return (
    <div
      className={`
        fixed top-5 left-1/2 -translate-x-1/2 z-[9999]
        transition-all duration-300 ease-out
        ${
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-8 pointer-events-none"
        }
      `}
    >
      <div
        className={`
          alert shadow-2xl rounded-2xl relative overflow-hidden
          ${alertStyle[type]}
          ${width}
        `}
      >
        <div className="w-full">
          <div className="flex items-start gap-3 w-full">
            {icon ? <span className="text-lg">{icon}</span> : null}

            <div className="flex-1">
              {title ? (
                <div className="font-bold text-sm leading-tight mb-1">
                  {title}
                </div>
              ) : null}

              <div className="text-sm">{message}</div>
            </div>

            {closable && (
              <button
                onClick={handleClose}
                className="btn btn-xs btn-circle btn-ghost"
              >
                ✕
              </button>
            )}
          </div>

          {showProgress && (
            <progress
              className={`progress h-1 mt-3 w-full ${progressStyle[type]}`}
              value={progress}
              max="100"
            />
          )}
        </div>
      </div>
    </div>
  );
}