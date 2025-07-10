"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/app/_lib/supabase";

const PRIZES = [
  { prize: "100_OFF", label: "100% OFF", chance: 0.05, code: "SPIN100" },
  { prize: "50_OFF", label: "50% OFF", chance: 0.1, code: "SPIN50" },
  { prize: "20_OFF", label: "20% OFF", chance: 0.15, code: "SPIN20" },
  { prize: "TRY_AGAIN", label: "Try Again", chance: 0.7, code: null },
];

function getRandomPrize() {
  const rand = Math.random();
  let acc = 0;
  for (let item of PRIZES) {
    acc += item.chance;
    if (rand <= acc) return item;
  }
  return PRIZES[PRIZES.length - 1];
}

export default function SpinWheelModal({ userId }) {
  const [hasSpun, setHasSpun] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(900);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const spun = localStorage.getItem("hasSpun");
    if (spun) setHasSpun(true);

    const checkSpin = async () => {
      const { data } = await supabase
        .from("spin_results")
        .select("*")
        .eq("user_id", userId);

      if (data && data.length > 0) {
        setHasSpun(true);
        setResult(data[0]);
        localStorage.setItem("hasSpun", "true");
      }
    };

    if (userId) checkSpin();
  }, [userId]);

  useEffect(() => {
    if (result && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [result]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const handleSpin = async () => {
    if (spinning || hasSpun) return;
    setSpinning(true);

    const prize = getRandomPrize();
    const degreesPerSegment = 360 / PRIZES.length;
    const segmentIndex = PRIZES.findIndex((p) => p.prize === prize.prize);
    const offset = Math.floor(Math.random() * degreesPerSegment);
    const finalRotation = 360 * 5 + segmentIndex * degreesPerSegment + offset;

    setRotation((prev) => prev + finalRotation);

    const { error: insertError } = await supabase.from("spin_results").insert([
      {
        user_id: userId,
        prize: prize.prize,
        discount_code: prize.code,
      },
    ]);

    if (insertError) {
      setError("You already spun or something went wrong.");
    } else {
      setResult(prize);
      localStorage.setItem("hasSpun", "true");
      setHasSpun(true);
    }

    setSpinning(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-base-100 max-w-md w-full rounded-box p-6 text-center shadow-2xl">
        <h2 className="text-3xl font-bold text-primary mb-6">🎡 Spin & Win!</h2>

        {result ? (
          <>
            <p className="text-lg font-semibold mb-2">
              {result.prize === "TRY_AGAIN"
                ? "😢 Better luck next time!"
                : `🎉 You won ${result.label || result.prize.replace("_", "")}!`}
            </p>

            {result.discount_code && (
              <>
                <p className="text-sm mb-2">
                  Use code <strong>{result.discount_code}</strong> at checkout
                </p>
                <a
                  href={`https://store.lemonsqueezy.com/checkout/YOUR_PRODUCT_ID?discount=${result.discount_code}`}
                  target="_blank"
                  className="btn btn-warning btn-sm"
                >
                  Claim Discount (⏱ {formatTime(countdown)})
                </a>
              </>
            )}
          </>
        ) : (
          <>
            <div className="relative w-64 h-64 mx-auto mb-6">
              <motion.div
                animate={{ rotate: rotation }}
                transition={{ duration: 4, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full border-8 border-primary flex items-center justify-center"
              >
                <div className="w-full h-full grid grid-cols-2 grid-rows-2 rotate-45">
                  {PRIZES.map((p, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-center text-sm font-bold text-base-content border border-base-200 bg-base-200"
                    >
                      {p.label}
                    </div>
                  ))}
                </div>
              </motion.div>
              <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-warning rounded-full z-10 transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>

            <button
              onClick={handleSpin}
              className="btn btn-primary"
              disabled={spinning || hasSpun}
            >
              {spinning ? "Spinning..." : "Spin Now"}
            </button>
          </>
        )}

        {error && <p className="text-error mt-4">{error}</p>}
      </div>
    </div>
  );
}
