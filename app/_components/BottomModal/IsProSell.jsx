"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

/*
  IsProSell — full upgrade modal + mini nudge
  Matches the exact dark-UI design shown in conversation.

  Props:
    formattedUsers  string   e.g. "1,200+"
    user            object   Supabase user row (null = guest)
    onUpgrade       fn       called when user clicks the CTA
    score           number   current game score
    isPersonalBest  bool     whether this game beat their best score
    mode            "mini" | "full"   controlled by parent periodicity logic
                    defaults to "full" if omitted
*/

const FEATURES = [
  { icon: "🌍", label: "Global percentile rank" },
  { icon: "📈", label: "Reaction trend over time" },
  { icon: "👁",  label: "Visual blind spot map"  },
  { icon: "⚡", label: "Fatigue curve per game"  },
  { icon: "🧠", label: "Brain age estimate"      },
  { icon: "🏆", label: "Country leaderboard rank"},
];

/* ── Animated rank bar (blurred right edge) ─────────────────────────────── */
function RankBar() {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(68), 120);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="flex items-center gap-2 mt-2">
      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", whiteSpace: "nowrap" }}>
        🔒 Global rank
      </span>
      <div
        className="flex-1 relative rounded-full overflow-hidden"
        style={{ height: 7, background: "rgba(255,255,255,0.07)" }}
      >
        <div
          style={{
            position: "absolute", top: 0, left: 0, height: "100%",
            width: `${width}%`,
            background: "linear-gradient(90deg,#7c3aed,#4f8ef7)",
            borderRadius: 9999,
            transition: "width 1.1s cubic-bezier(0.34,1.2,0.64,1)",
          }}
        />
        {/* fade-out blur suggesting hidden content */}
        <div
          style={{
            position: "absolute", top: 0, right: 0, height: "100%", width: "38%",
            background: "linear-gradient(90deg, transparent, #0d0d1a)",
          }}
        />
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color: "#a78bfa", whiteSpace: "nowrap" }}>
        Top ?%
      </span>
    </div>
  );
}

/* ── Full upgrade modal overlay ─────────────────────────────────────────── */
function FullModal({ score, isPersonalBest, formattedUsers, user, onUpgrade, onDismiss }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  const handleDismiss = () => {
    setMounted(false);
    setTimeout(onDismiss, 220);
  };

  const handleUpgrade = () => {
    onUpgrade?.();
  };

  return (
    <div
      onClick={handleDismiss}
      style={{
        position: "fixed", inset: 0, zIndex: 60,
        display: "flex", alignItems: "flex-end",
        justifyContent: "center",
        background: "rgba(0,0,0,0.72)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        opacity: mounted ? 1 : 0,
        transition: "opacity 0.22s ease",
      }}
    >
      {/* Sheet */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 420,
          borderRadius: "20px 20px 0 0",
          overflow: "hidden",
          background: "#0d0d1a",
          border: "1px solid rgba(255,255,255,0.07)",
          borderBottom: "none",
          transform: mounted ? "translateY(0)" : "translateY(48px)",
          transition: "transform 0.28s cubic-bezier(0.34,1.3,0.64,1)",
          /* desktop: center it and add bottom radius */
        }}
        className="sm:rounded-2xl sm:mb-6"
      >
        {/* ── Top band ── */}
        <div
          style={{
            background: "linear-gradient(135deg,#1a1040 0%,#0d1a2e 100%)",
            padding: "20px 20px 16px",
            position: "relative",
          }}
        >
          <button
            onClick={handleDismiss}
            style={{
              position: "absolute", top: 14, right: 14,
              background: "rgba(255,255,255,0.08)", border: "none",
              color: "rgba(255,255,255,0.5)", borderRadius: "50%",
              width: 28, height: 28, cursor: "pointer",
              fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.15s",
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.16)"}
            onMouseOut={(e)  => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
          >
            ✕
          </button>

          {/* Score + personal best badge */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginBottom: 4 }}>
            <div style={{ fontSize: 44, fontWeight: 800, color: "#fff", letterSpacing: -2, lineHeight: 1 }}>
              {typeof score === "number" ? score.toLocaleString() : score}
            </div>
            {isPersonalBest && (
              <div
                style={{
                  marginBottom: 6, fontSize: 11, fontWeight: 700,
                  padding: "3px 10px", borderRadius: 9999,
                  background: "rgba(74,222,128,0.14)",
                  color: "#4ade80",
                  border: "1px solid rgba(74,222,128,0.28)",
                }}
              >
                🏆 Personal best
              </div>
            )}
          </div>

          <RankBar />
        </div>

        {/* ── Body ── */}
        <div style={{ padding: "18px 20px 20px" }}>

          {/* Headline */}
          <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 3 }}>
            {isPersonalBest ? "You just peaked — see where you rank" : "See where you actually rank"}
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.38)", marginBottom: 16 }}>
            {formattedUsers} sessions benchmarked — yours is one of them
          </div>

          {/* Feature grid */}
          <div
            style={{
              display: "grid", gridTemplateColumns: "1fr 1fr",
              gap: 8, marginBottom: 18,
            }}
          >
            {FEATURES.map((f) => (
              <div
                key={f.label}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  fontSize: 12, color: "rgba(255,255,255,0.62)",
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: 10, padding: "8px 11px",
                }}
              >
                <span style={{ fontSize: 15 }}>{f.icon}</span>
                {f.label}
              </div>
            ))}
          </div>

          {/* CTA button */}
          {!user ? (
            <Link href="/get-pro" style={{ display: "block", textDecoration: "none" }}>
              <button
                style={{
                  width: "100%", padding: "14px 0",
                  borderRadius: 13, border: "none",
                  background: "linear-gradient(135deg,#7c3aed,#4f8ef7)",
                  color: "#fff", fontSize: 15, fontWeight: 700,
                  cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
                  transition: "opacity 0.15s, transform 0.1s",
                }}
                onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"}
                onMouseOut={(e)  => e.currentTarget.style.opacity = "1"}
                onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.98)"}
                onMouseUp={(e)   => e.currentTarget.style.transform = "scale(1)"}
              >
                Unlock lifetime access
                <span
                  style={{
                    fontSize: 12, fontWeight: 800,
                    padding: "3px 11px", borderRadius: 9999,
                    background: "rgba(255,255,255,0.2)",
                  }}
                >
                  $4.99 once
                </span>
              </button>
            </Link>
          ) : (
            <button
              onClick={handleUpgrade}
              style={{
                width: "100%", padding: "14px 0",
                borderRadius: 13, border: "none",
                background: isPersonalBest
                  ? "linear-gradient(135deg,#065f46,#047857)"
                  : "linear-gradient(135deg,#7c3aed,#4f8ef7)",
                color: "#fff", fontSize: 15, fontWeight: 700,
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
                transition: "opacity 0.15s, transform 0.1s",
              }}
              onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"}
              onMouseOut={(e)  => e.currentTarget.style.opacity = "1"}
              onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.98)"}
              onMouseUp={(e)   => e.currentTarget.style.transform = "scale(1)"}
            >
              Unlock lifetime access
              <span
                style={{
                  fontSize: 12, fontWeight: 800,
                  padding: "3px 11px", borderRadius: 9999,
                  background: "rgba(255,255,255,0.2)",
                }}
              >
                $4.99 once
              </span>
            </button>
          )}

          {/* Social proof */}
          <div
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 6, marginTop: 10, fontSize: 11,
              color: "rgba(255,255,255,0.22)",
            }}
          >
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(74,222,128,0.45)", display: "inline-block" }} />
            No subscription · 700+ players unlocked this
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(74,222,128,0.45)", display: "inline-block" }} />
          </div>

          {/* Soft dismiss */}
          <button
            onClick={handleDismiss}
            style={{
              display: "block", width: "100%",
              marginTop: 10, padding: "6px 0",
              background: "none", border: "none",
              fontSize: 12, color: "rgba(255,255,255,0.2)",
              cursor: "pointer", transition: "color 0.15s",
            }}
            onMouseOver={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.45)"}
            onMouseOut={(e)  => e.currentTarget.style.color = "rgba(255,255,255,0.2)"}
          >
            Not now — keep playing free
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Mini nudge — 1 quiet line, shown on most games ─────────────────────── */
function MiniNudge({ isPersonalBest, onExpand }) {
  return (
    <div
      onClick={onExpand}
      style={{
        marginTop: 12,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "9px 13px", borderRadius: 10,
        cursor: "pointer",
        background: isPersonalBest
          ? "rgba(74,222,128,0.07)"
          : "rgba(124,58,237,0.07)",
        border: isPersonalBest
          ? "1px solid rgba(74,222,128,0.18)"
          : "1px solid rgba(124,58,237,0.18)",
        transition: "background 0.15s",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.background = isPersonalBest
          ? "rgba(74,222,128,0.13)"
          : "rgba(124,58,237,0.13)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = isPersonalBest
          ? "rgba(74,222,128,0.07)"
          : "rgba(124,58,237,0.07)";
      }}
    >
      <span style={{ fontSize: 12, color: isPersonalBest ? "#4ade80" : "#a78bfa" }}>
        {isPersonalBest ? "🏆 Personal best — see your global rank" : "🔒 Your global rank is hidden"}
      </span>
      <span
        style={{
          fontSize: 11, fontWeight: 700,
          padding: "3px 10px", borderRadius: 9999,
          background: isPersonalBest ? "rgba(74,222,128,0.15)" : "rgba(124,58,237,0.2)",
          color: isPersonalBest ? "#4ade80" : "#c084fc",
          border: isPersonalBest ? "1px solid rgba(74,222,128,0.3)" : "1px solid rgba(124,58,237,0.3)",
          whiteSpace: "nowrap",
        }}
      >
        Unlock $4.99 →
      </span>
    </div>
  );
}

/* ── Inline full CTA — shown on game 3/6/9 inside the bottom sheet ──────── */
function InlineCTA({ isPersonalBest, onExpand }) {
  return (
    <button
      onClick={onExpand}
      style={{
        marginTop: 12, width: "100%",
        padding: "13px 16px", borderRadius: 13, border: "none",
        cursor: "pointer",
        background: isPersonalBest
          ? "linear-gradient(135deg,#064e3b,#065f46)"
          : "linear-gradient(135deg,#1e1040,#1a2a4a)",
        borderColor: isPersonalBest
          ? "rgba(74,222,128,0.28)"
          : "rgba(124,58,237,0.28)",
        borderWidth: 1, borderStyle: "solid",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        color: isPersonalBest ? "#4ade80" : "#a78bfa",
        fontSize: 14, fontWeight: 700,
        transition: "opacity 0.15s, transform 0.1s",
      }}
      onMouseOver={(e) => e.currentTarget.style.opacity = "0.88"}
      onMouseOut={(e)  => e.currentTarget.style.opacity = "1"}
      onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.98)"}
      onMouseUp={(e)   => e.currentTarget.style.transform = "scale(1)"}
    >
      {isPersonalBest
        ? "🏆 Personal best — unlock your global rank"
        : "🔒 Unlock your full Brain Report"}
      <span
        style={{
          fontSize: 11, fontWeight: 800,
          padding: "3px 10px", borderRadius: 9999,
          background: isPersonalBest ? "rgba(74,222,128,0.18)" : "rgba(124,58,237,0.22)",
          border: isPersonalBest ? "1px solid rgba(74,222,128,0.3)" : "1px solid rgba(124,58,237,0.3)",
        }}
      >
        $4.99 once
      </span>
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Main export
───────────────────────────────────────────────────────────────────────────── */
export default function IsProSell({
  formattedUsers = "1,200+",
  user,
  onUpgrade,
  score = 0,
  isPersonalBest = false,
  mode = "full", // "none" | "mini" | "full"  — controlled by parent
}) {
  const [showModal, setShowModal] = useState(false);

  // Auto-open the overlay for "full" mode after a short delay
  // so the user sees their score first
  const autoOpenRef = useRef(false);
  useEffect(() => {
    if (mode === "full" && !autoOpenRef.current) {
      autoOpenRef.current = true;
      const t = setTimeout(() => setShowModal(true), 900);
      return () => clearTimeout(t);
    }
  }, [mode]);

  if (mode === "none") return null;

  return (
    <>
      {/* Inline element inside the bottom sheet */}
      {mode === "mini" && (
        <MiniNudge
          isPersonalBest={isPersonalBest}
          onExpand={() => setShowModal(true)}
        />
      )}

      {mode === "full" && !showModal && (
        <InlineCTA
          isPersonalBest={isPersonalBest}
          onExpand={() => setShowModal(true)}
        />
      )}

      {/* Full overlay modal */}
      {showModal && (
        <FullModal
          score={score}
          isPersonalBest={isPersonalBest}
          formattedUsers={formattedUsers}
          user={user}
          onUpgrade={onUpgrade}
          onDismiss={() => setShowModal(false)}
        />
      )}
    </>
  );
}