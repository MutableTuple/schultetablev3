"use client";
import React, { useEffect, useState } from "react";
import { FaTrophy, FaArrowRight, FaChartLine } from "react-icons/fa";
import { IoMdTrendingUp } from "react-icons/io";
import { getAllUsers } from "@/app/_lib/data-service";
import { getRandomUsers } from "@/app/_utils/helper";

export default function GameLoginPrompt({ isLoggedIn = false }) {
  const [showModal, setShowModal] = useState(false);
  const [lastScores, setLastScores] = useState([]);
  const [percentile, setPercentile] = useState(0);
  const [users, setUsers] = useState([]);
  const randomUsers = getRandomUsers(users);
  const extraUsers = users.length - randomUsers.length;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await getAllUsers();
        setUsers(allUsers);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const check = () => {
      const played = Number(localStorage.getItem("gamesPlayed") || 0);
      const alreadyShown = localStorage.getItem("loginPromptShown") === "true";
      const scores = JSON.parse(localStorage.getItem("lastScores") || "[]");

      if (!isLoggedIn && played >= 3 && !alreadyShown) {
        localStorage.setItem("loginPromptShown", "true");
        setShowModal(true);
        setLastScores(scores.slice(-3).reverse());

        // Fake percentile: 70–99%
        const randomPercentile = Math.floor(Math.random() * 30) + 70;
        setPercentile(randomPercentile);

        if (typeof window.gtag === "function") {
          window.gtag("event", "login_prompt_shown", {
            gamesPlayed: played,
          });
        }
      }
    };

    window.addEventListener("gamesPlayedUpdated", check);
    return () => window.removeEventListener("gamesPlayedUpdated", check);
  }, [isLoggedIn]);

  const handleDismiss = () => {
    setShowModal(false);
    if (typeof window.gtag === "function") {
      window.gtag("event", "login_prompt_dismissed", {
        gamesPlayed: localStorage.getItem("gamesPlayed"),
      });
    }
  };

  const handleAccess = () => {
    setShowModal(false);
    if (typeof window.gtag === "function") {
      window.gtag("event", "login_prompt_accessed", {
        gamesPlayed: localStorage.getItem("gamesPlayed"),
      });
    }
    window.location.href = "/auth/login";
  };

  return (
    <>
      {showModal && (
        <div className="modal modal-open fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="modal-box shadow-xl text-center p-6 bg-white border border-gray-200 w-full max-w-md rounded-none">
            <div className="flex items-center justify-center gap-2 mb-2 text-yellow-600 text-xl font-semibold">
              <FaTrophy />
              You’re on fire!
            </div>
            <p className="text-gray-700 text-sm">
              Continue your growth journey — sign up to personalize your
              progress and stay on track.
            </p>
            {lastScores.lenth > 0 && (
              <div className="mt-4 text-left text-sm">
                <p className="text-gray-700 font-medium mb-1 flex items-center gap-1">
                  <FaChartLine /> Last Game Scores:
                </p>
                <ul className="ml-4 text-gray-500 list-disc">
                  {lastScores.map((score, i) => (
                    <li key={i}>
                      Game {lastScores.length - i}: {score} pts
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="mt-4 text-green-600 font-medium text-sm flex items-center justify-center gap-1">
              <IoMdTrendingUp /> You're currently better than{" "}
              <strong>{percentile}%</strong> of players!
            </p>
            {/* users portfolios */}
            {/* {users.length > 3 && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 mb-2 font-medium">
                  🔥 People like you are training daily!
                </p>
                <div className="flex justify-center gap-2 items-center">
                  {randomUsers.map((user, idx) => (
                    <div
                      key={idx}
                      className="tooltip"
                      data-tip={user?.name || "User"}
                    >
                      <img
                        src={user?.image || "/default-avatar.png"}
                        alt={user?.name || "User"}
                        className="w-8 h-8 rounded-full border-2 border-white shadow-md hover:scale-105 transition-transform"
                      />
                    </div>
                  ))}

                  <div
                    className="tooltip text-sm text-gray-700 font-medium"
                    data-tip={`${extraUsers} more users training daily`}
                  >
                    <span>+{extraUsers} more</span>
                  </div>
                </div>
              </div>
            )} */}
            {/* users portfolios */}
            <div className="modal-action justify-center mt-6 gap-4">
              <button
                onClick={handleAccess}
                className="btn btn-primary px-5 py-2 border-none text-white rounded-none"
              >
                <FaArrowRight className="mr-2" /> Login / Sign Up
              </button>
              <button
                onClick={handleDismiss}
                className="btn btn-outline text-gray-600 border-gray-300 rounded-none"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
