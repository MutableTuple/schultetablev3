"use client";
import React, { useEffect, useState } from "react";
import { differenceInSeconds, intervalToDuration, parseISO } from "date-fns";
import { FaGlobe } from "react-icons/fa";
import { supabase } from "@/app/_lib/supabase";
import Confetti from "react-dom-confetti";

export default function MissionsHeader({ mission }) {
  const missionData = mission[0];
  const start = new Date(missionData.created_at);
  const end = new Date(missionData.duration);
  const total = Number(missionData.actual_mission_value || 0);
  const [isComplete, setIsComplete] = useState(false);
  const [remaining, setRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [gameProgress, setGameProgress] = useState(0);
  const [contributors, setContributors] = useState([]);

  // ⏳ Countdown timer
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const duration = intervalToDuration({ start: now, end });
      const secondsLeft = differenceInSeconds(end, now);

      setRemaining(
        secondsLeft <= 0
          ? { days: 0, hours: 0, minutes: 0, seconds: 0 }
          : {
              days: duration.days || 0,
              hours: duration.hours || 0,
              minutes: duration.minutes || 0,
              seconds: duration.seconds || 0,
            }
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [missionData.duration]);

  // 📊 Fetch real-time progress
  useEffect(() => {
    const fetchProgress = async () => {
      // ✅ Count all games (including anonymous)
      const { count, error } = await supabase
        .from("UniversalGameStats")
        .select("*", { count: "exact", head: true })
        .gte("created_at", start.toISOString())
        .lte("created_at", end.toISOString());

      if (!error) {
        setGameProgress(count);
      }

      // ✅ Contributors: only real users
      const { data: contributorsData } = await supabase
        .from("UniversalGameStats")
        .select("user_id, Users!inner(image, username)")
        .not("user_id", "is", null)
        .gte("created_at", start.toISOString())
        .lte("created_at", end.toISOString());

      const unique = new Map();
      contributorsData?.forEach((entry) => {
        if (!unique.has(entry.user_id)) {
          unique.set(entry.user_id, entry.Users);
        }
      });

      setContributors(Array.from(unique.values()).slice(0, 3));
    };

    fetchProgress();
  }, [mission]);

  useEffect(() => {
    if (total > 0 && gameProgress >= total) {
      setIsComplete(true);
    }
  }, [gameProgress, total]);

  const percentage = total > 0 ? (gameProgress / total) * 100 : 0;

  return (
    <div className="w-full mx-auto p-6 border-b border-base-300 bg-base-100 flex flex-col items-center text-center gap-6 bg-base-200 rounded-xl">
      {/* Title + Description */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-base-content flex items-center justify-center">
          <FaGlobe className="inline-block mr-2 text-warning" />
          {missionData.mission_title}
        </h2>
        <p className="text-sm text-base-content/60 mt-1 max-w-xl">
          {missionData.mission_description}
        </p>
      </div>

      {/* Avatar Group */}
      {/* <div className="avatar-group -space-x-4">
        {contributors.map((user, index) => (
          <div key={index} className="avatar">
            <div className="w-12 h-12 rounded-full border border-base-300 bg-base-200 p-1">
              <img
                src={user.image}
                alt={user.username}
                className="rounded-full object-cover w-full h-full"
              />
            </div>
          </div>
        ))}
        {contributors.length > 3 && (
          <div className="avatar placeholder">
            <div className="w-12 h-12 rounded-full bg-neutral text-neutral-content border border-base-300">
              <span className="text-sm font-medium">
                +{contributors.length - 3}
              </span>
            </div>
          </div>
        )}
      </div> */}

      {/* Progress Bar */}
      <div className="w-full max-w-md">
        <div className="relative h-4 rounded-full overflow-hidden border border-base-300 bg-base-300">
          <div
            className="absolute top-0 left-0 h-full transition-all duration-500 bg-gradient-to-r from-warning via-orange-400 to-pink-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
        {isComplete && (
          <div className="text-center mt-6 relative">
            <h3 className="text-lg font-semibold text-green-600">
              🎉 Mission Completed! Great work, everyone!
            </h3>
            <div className="absolute left-1/2 transform -translate-x-1/2 mt-2">
              <Confetti active={isComplete} />
            </div>
          </div>
        )}
        <p className="mt-2 text-xs text-base-content/60">
          {gameProgress} of {total} games completed
        </p>
      </div>

      {/* Countdown */}
      {!isComplete && (
        <>
          <p className="text-xs text-base-content/70 mb-1">Ending in</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
            {["days", "hours", "minutes", "seconds"].map((unit) => (
              <div
                key={unit}
                className="flex flex-col items-center px-2 py-1 bg-base-200 rounded-lg border border-base-300"
              >
                <span className="countdown font-mono text-xl sm:text-3xl">
                  <span
                    style={{ "--value": remaining[unit] }}
                    aria-label={remaining[unit]}
                  >
                    {remaining[unit]}
                  </span>
                </span>
                <span className="mt-1 capitalize text-[10px] sm:text-xs opacity-70">
                  {unit}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
