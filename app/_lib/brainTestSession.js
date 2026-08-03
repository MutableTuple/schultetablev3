import { v4 as uuidv4 } from "uuid";

const SESSION_KEY = "brain_test_session";
const TOTAL_ROUNDS = 10;

/* ===========================================
   SESSION (the in-progress / finished 10-round attempt)
=========================================== */

export function getSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persist(session) {
  if (typeof window === "undefined") return session;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function createSession() {
  const session = {
    sessionId: uuidv4(),
    startedAt: new Date().toISOString(),
    completedAt: null,
    claimed: false,
    rounds: [],
  };
  return persist(session);
}

export function getOrCreateSession() {
  return getSession() || createSession();
}

export function addRound(session, roundSummary) {
  const updated = {
    ...session,
    rounds: [...session.rounds, roundSummary],
  };
  if (updated.rounds.length >= TOTAL_ROUNDS) {
    updated.completedAt = new Date().toISOString();
  }
  return persist(updated);
}

export function isSessionComplete(session) {
  return !!session && session.rounds.length >= TOTAL_ROUNDS;
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

export function markClaimed(session) {
  return persist({ ...session, claimed: true });
}

/* ===========================================
   MIRROR INTO SHARED GAME-HISTORY LOCALSTORAGE KEYS
   — same shape/keys SchulteTable.jsx's saveGameToLocalHistory writes,
   so RightDrawer / report-unlock badge / etc. treat brain-test rounds
   exactly like normal games without any changes on their end.
=========================================== */

export function saveRoundToGameHistory(summary, userId) {
  if (typeof window === "undefined") return;
  try {
    const oldKey = "schulte_last_10_games";
    const oldHistory = JSON.parse(localStorage.getItem(oldKey) || "[]");
    localStorage.setItem(
      oldKey,
      JSON.stringify([summary, ...oldHistory].slice(0, 100)),
    );

    const newKey = userId
      ? `schulte_history_user_${userId}`
      : "schulte_history_guest";
    const newHistory = JSON.parse(localStorage.getItem(newKey) || "[]");
    localStorage.setItem(
      newKey,
      JSON.stringify([summary, ...newHistory].slice(0, 100)),
    );
  } catch (e) {
    console.error("Failed to mirror brain-test round to game history", e);
  }
}

export function bumpGamesSinceLastReport() {
  if (typeof window === "undefined") return;
  try {
    const saved = Number(localStorage.getItem("games_since_last_report")) || 0;
    const next = Math.min(saved + 1, 10);
    localStorage.setItem("games_since_last_report", String(next));
    if (next >= 10) {
      localStorage.setItem("report_unlocked", "true");
    }
  } catch (e) {
    console.error("Failed to bump games_since_last_report", e);
  }
}

export const BRAIN_TEST_TOTAL_ROUNDS = TOTAL_ROUNDS;
