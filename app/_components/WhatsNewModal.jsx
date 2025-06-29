"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  MdGridView,
  MdFunctions,
  MdHistory,
  MdSpeed,
  MdStar,
  MdTimeline,
  MdTouchApp,
  MdAnalytics,
} from "react-icons/md";
import { getCurrentUser } from "../_utils/getCurrentUser";

export default function WhatsNewModal() {
  const [hasSeen, setHasSeen] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const { user } = await getCurrentUser();
      setUser(user);
    };

    checkUser();

    const seen = localStorage.getItem("whats-new-seen");
    if (!seen) {
      setHasSeen(false);
      setTimeout(() => {
        document.getElementById("whats_new_modal")?.showModal();
      }, 500);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("whats-new-seen", "true");
    setHasSeen(true);
  };

  return (
    <dialog id="whats_new_modal" className="modal backdrop-blur-sm bg-black/30">
      <div className="modal-box border border-base-300 shadow-xl p-6 bg-base-100 text-base-content rounded-none max-w-md w-full">
        <form method="dialog" className="absolute top-2 right-2">
          <button
            onClick={handleClose}
            className="btn btn-sm btn-ghost text-xl"
          >
            ✕
          </button>
        </form>

        <h3 className="text-lg font-bold mb-4 border-b pb-2 uppercase tracking-wide">
          What&apos;s New? in v3.0.0
        </h3>

        <ul className="space-y-3 text-sm">
          <li className="flex items-start gap-2">
            <MdGridView className="text-primary text-lg mt-1" />
            Five unique Schulte modes: Number, Word, Alphabet, Emoji, Maths
          </li>
          <li className="flex items-start gap-2">
            <MdFunctions className="text-primary text-lg mt-1" />
            All grid sizes up to 7×7 supported
          </li>
          <li className="flex items-start gap-2">
            <MdSpeed className="text-primary text-lg mt-1" />
            Smooth animations, scoring, and game history
          </li>
          <li className="flex items-start gap-2">
            <MdFunctions className="text-primary text-lg mt-1" />
            Advanced maths grid for brain training
          </li>
          <li className="flex items-start gap-2">
            <MdStar className="text-primary text-lg mt-1" />
            Pro mode now available
          </li>
          <li className="flex items-start gap-2">
            <MdAnalytics className="text-primary text-lg mt-1" />
            Advanced analytics for users
          </li>
          <li className="flex items-start gap-2">
            <MdTouchApp className="text-primary text-lg mt-1" />
            Track duration between each click
          </li>
          <li className="flex items-start gap-2">
            <MdTimeline className="text-primary text-lg mt-1" />
            Enhanced accuracy tracking & more
          </li>
        </ul>

        {!user && (
          <div className="mt-4 w-full flex items-center justify-center">
            <Link href="/auth/login">
              <span className="btn btn-sm btn-primary">
                Sign In to Personalize
              </span>
            </Link>
          </div>
        )}

        <p className="mt-4 text-xs text-gray-500">
          Press ESC or click ✕ to close this update.
        </p>
      </div>
    </dialog>
  );
}
