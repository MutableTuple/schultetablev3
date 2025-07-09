"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotLoggedInModal({
  user,
  message = "To continue, please log in. We're excited to have you here!",
  loginUrl = "/login",
  buttonText = "Login Now",
  showLater = true,
}) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!user) {
      setShowModal(true);

      // GA4 Event: modal viewed
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "login_modal_viewed", {
          event_category: "engagement",
          event_label: "Login modal shown to user",
        });
      }
    }
  }, [user]);

  const handleClose = () => {
    setShowModal(false);

    // GA4 Event: modal dismissed
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "login_modal_dismissed", {
        event_category: "engagement",
        event_label: "User clicked Maybe Later",
      });
    }
  };

  const handleLoginClick = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "login_modal_signin_clicked", {
        event_category: "engagement",
        event_label: "User clicked Sign In from login modal",
      });
    }
  };

  if (!showModal) return null;

  return (
    <>
      <input
        type="checkbox"
        id="not-logged-in-modal"
        className="modal-toggle"
        checked
        readOnly
      />
      <div className="modal modal-open backdrop-blur-sm">
        <div className="modal-box bg-base-100 border border-base-300 shadow-xl rounded-lg">
          <h3 className="font-bold text-xl text-warning">👋 Hey there!</h3>
          <p className="py-4 text-base-content/80 leading-relaxed">{message}</p>

          <div className="modal-action">
            <Link
              href={loginUrl}
              className="btn btn-success font-medium rounded-lg"
              onClick={handleLoginClick}
            >
              {buttonText}
            </Link>
            {showLater && (
              <button
                onClick={handleClose}
                className="btn btn-ghost font-medium"
              >
                Maybe Later
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
