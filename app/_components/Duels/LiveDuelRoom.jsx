"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Trophy, Users, ArrowLeft, Flag, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/app/_lib/supabase";
import BoardGrid from "@/app/_components/Schultetable/BoardGrid";
import { calculateScore } from "@/app/_components/Schultetable/scoreUtils";
import PaymentLink from "@/app/_components/AdvancedGameModal/PaymentLink";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
} from "recharts";

const FORFEIT_GRACE_MS = 6000;

function fmtSeconds(ms) {
  if (ms == null) return "—";
  return `${(ms / 1000).toFixed(2)}s`;
}

function DuelProUpsell({ user }) {
  return (
    <div className="bg-card border border-primary/20 rounded-2xl p-5 space-y-4 text-left">
      <div className="flex items-center gap-2">
        <Sparkles size={16} className="text-primary" />
        <p className="text-xs font-bold uppercase tracking-widest text-primary">Go Pro</p>
      </div>
      <div>
        <h3 className="text-base font-bold text-foreground">Track every duel you play</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Full accuracy trends, reaction-time breakdowns, and your complete match history —
          unlocked with Pro.
        </p>
      </div>
      <PaymentLink user={user} userId={user?.id} />
    </div>
  );
}

export default function LiveDuelRoom({ user, duelId }) {
  const userId = user?.user?.id ?? null;
  const isProUser = Boolean(user?.user?.is_pro_user || user?.user?.purchase_plan);

  const [duel, setDuel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [opponentPresent, setOpponentPresent] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [clickedNumbers, setClickedNumbers] = useState([]);
  const [myFinished, setMyFinished] = useState(false);
  const [myTimeMs, setMyTimeMs] = useState(null);
  const [mistakes, setMistakes] = useState(0);
  const [clickData, setClickData] = useState([]);
  const [country, setCountry] = useState("US");

  const presenceChannelRef = useRef(null);
  const updatesChannelRef = useRef(null);
  const forfeitTimerRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const startedRef = useRef(false); // guards against calling /start twice locally
  const readyAttemptedRef = useRef(false); // guards against calling ready twice locally
  const lastClickTimeRef = useRef(null);

  const isChallenger = duel?.challenger_id === userId;
  const opponent = isChallenger ? duel?.opponent : duel?.challenger;
  const opponentId = opponent?.id ?? null;

  // "Ready" state lives in the DB (challenger_ready / opponent_ready),
  // updated via PATCH and picked up here through the same postgres_changes
  // subscription used for everything else in this room — not Presence
  // metadata, which turned out not to reliably propagate a second track()
  // update between the two clients.
  const myReady = isChallenger ? Boolean(duel?.challenger_ready) : Boolean(duel?.opponent_ready);
  const opponentReady = isChallenger ? Boolean(duel?.opponent_ready) : Boolean(duel?.challenger_ready);

  const markReady = useCallback(async () => {
    try {
      const res = await fetch(`/api/duels/${duelId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action: "ready" }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to mark ready");
      // Optimistic update — don't rely solely on the postgres_changes
      // socket event for our own state; if that event is delayed or
      // dropped, this would otherwise look stuck.
      setDuel((prev) => ({ ...prev, ...json.duel }));
    } catch (err) {
      readyAttemptedRef.current = false; // allow retry
      toast.error(err.message || "Failed to ready up — retrying...");
    }
  }, [duelId, userId]);

  // ── Fetch the duel initially ────────────────────────────────────────────
  const fetchDuel = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/duels/${duelId}?userId=${userId}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Duel not found");
      setDuel(json.duel);
    } catch (err) {
      toast.error(err.message || "Failed to load duel");
    } finally {
      setLoading(false);
    }
  }, [duelId, userId]);

  useEffect(() => {
    fetchDuel();
  }, [fetchDuel]);

  // ── Country for the same UniversalGameStats fields single-player games
  // already record. ────────────────────────────────────────────────────────
  useEffect(() => {
    fetch("/api/region")
      .then((res) => res.json())
      .then((data) => setCountry(data.country))
      .catch(() => {});
  }, []);

  // ── Realtime: keep the duel row in sync (start_duel / finish_duel /
  // forfeit_duel all mutate it, and both players need to see that live). ──
  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel(`duel-updates-${duelId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "Duels", filter: `id=eq.${duelId}` },
        (payload) => setDuel((prev) => ({ ...prev, ...payload.new })),
      )
      .subscribe();
    updatesChannelRef.current = channel;
    return () => {
      supabase.removeChannel(channel);
    };
  }, [duelId, userId]);

  // opponentId isn't known until `duel` finishes loading — read it via a
  // ref inside the presence handlers instead of closing over it, so the
  // channel below never needs to be recreated once it's live.
  const opponentIdRef = useRef(null);
  useEffect(() => {
    opponentIdRef.current = opponentId;
  }, [opponentId]);

  // ── Presence: who's actually in the room right now. Also the basis for
  // forfeit-on-disconnect detection. This channel is created exactly once
  // per duel visit. ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!userId || !duelId) return;

    const channel = supabase.channel(`duel-presence-${duelId}`, {
      config: { presence: { key: userId } },
    });
    presenceChannelRef.current = channel;

    const syncPresence = () => {
      const oppId = opponentIdRef.current;
      const state = channel.presenceState();
      if (oppId && state[oppId]?.length) {
        setOpponentPresent(true);
        if (forfeitTimerRef.current) {
          clearTimeout(forfeitTimerRef.current);
          forfeitTimerRef.current = null;
        }
      } else {
        setOpponentPresent(false);
      }
    };

    channel
      .on("presence", { event: "sync" }, syncPresence)
      .on("presence", { event: "join" }, syncPresence)
      .on("presence", { event: "leave" }, ({ key }) => {
        if (key !== opponentIdRef.current) return;
        setOpponentPresent(false);
        // Grace period in case it's just a brief reconnect/refresh, not a
        // real rage-quit — only forfeit if they're still gone after this.
        if (forfeitTimerRef.current) clearTimeout(forfeitTimerRef.current);
        forfeitTimerRef.current = setTimeout(async () => {
          const oppId = opponentIdRef.current;
          const state = channel.presenceState();
          if (oppId && !state[oppId]?.length) {
            try {
              await fetch(`/api/duels/${duelId}/forfeit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ leavingUserId: oppId }),
              });
            } catch {
              // best-effort
            }
          }
        }, FORFEIT_GRACE_MS);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ joinedAt: Date.now() });
          syncPresence();
        }
      });

    return () => {
      if (forfeitTimerRef.current) clearTimeout(forfeitTimerRef.current);
      channel.untrack();
      supabase.removeChannel(channel);
    };
  }, [duelId, userId]);

  // ── Auto-ready — no manual "I'm Ready" click. The moment this client has
  // the duel loaded and it's actually live, mark ready automatically so the
  // race starts as soon as both players' pages have loaded, instead of
  // waiting on either of them to press a button. ──────────────────────────
  useEffect(() => {
    if (!duel || myReady || readyAttemptedRef.current) return;
    if (!["active", "in_progress"].includes(duel.status)) return;
    readyAttemptedRef.current = true;
    markReady();
  }, [duel, myReady, markReady]);

  // ── Once both are ready and nobody has started the race yet, kick it
  // off. Idempotent server-side, so it's safe if both clients call it. ────
  useEffect(() => {
    if (!myReady || !opponentReady || !duel || duel.started_at || startedRef.current) return;
    startedRef.current = true;
    (async () => {
      try {
        const res = await fetch(`/api/duels/${duelId}/start`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to start duel");
        if (json.boardNumbers?.length) {
          setDuel((prev) => ({ ...prev, board_numbers: json.boardNumbers, started_at: json.startedAt }));
        }
      } catch (err) {
        startedRef.current = false; // allow retry — a failed/errored call must not block future attempts
        toast.error(err.message || "Failed to start duel — retrying...");
      }
    })();
  }, [myReady, opponentReady, duel, duelId, userId]);

  // ── Safety net: the realtime socket has repeatedly dropped updates in
  // this room (ready flips, started_at, and completion) — poll as a
  // fallback for the whole live duel, from the ready screen through
  // "waiting for opponent to finish". Stops once the duel reaches a
  // terminal status, so it doesn't run forever on the results screen. ─────
  useEffect(() => {
    if (!duel || !["active", "in_progress"].includes(duel.status)) return;
    const interval = setInterval(fetchDuel, 3000);
    return () => clearInterval(interval);
  }, [duel, fetchDuel]);

  // ── Countdown → unlock the board at the shared started_at instant. ──────
  useEffect(() => {
    if (!duel?.started_at || gameStarted) return;

    const tick = () => {
      const msLeft = new Date(duel.started_at).getTime() - Date.now();
      if (msLeft <= 0) {
        setCountdown(0);
        setGameStarted(true);
        lastClickTimeRef.current = Date.now();
        clearInterval(countdownIntervalRef.current);
      } else {
        setCountdown(Math.ceil(msLeft / 1000));
      }
    };
    tick();
    countdownIntervalRef.current = setInterval(tick, 150);
    return () => clearInterval(countdownIntervalRef.current);
  }, [duel?.started_at, gameStarted]);

  // ── Board interaction — same "smallest unclicked number is the target"
  // logic as the single-player board, just racing against a shared board. ─
  const boardNumbers = duel?.board_numbers ?? [];
  const nextTarget = useMemo(() => {
    const remaining = boardNumbers.filter((n) => !clickedNumbers.includes(n));
    return remaining.length ? Math.min(...remaining) : null;
  }, [boardNumbers, clickedNumbers]);

  const finishRace = useCallback(
    async (finalClickData) => {
      const timeMs = Date.now() - new Date(duel.started_at).getTime();
      const totalTiles = boardNumbers.length;
      setMyFinished(true);
      setMyTimeMs(timeMs);

      const times = finalClickData.map((d) => d.timeTakenMs);
      const avg = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;
      const min = times.length ? Math.min(...times) : 0;
      const max = times.length ? Math.max(...times) : 0;
      const std = times.length
        ? Math.round(Math.sqrt(times.reduce((acc, t) => acc + (t - avg) ** 2, 0) / times.length))
        : 0;

      const score = calculateScore({
        durationMs: timeMs,
        mistakes,
        difficulty: duel.difficulty,
        gridSize: duel.grid_size,
        avgReactionTimeMs: avg,
        consistencyScore: std,
      });

      const accuracy = Number(((totalTiles / (totalTiles + mistakes)) * 100).toFixed(1));

      let gameId = null;
      try {
        const res = await fetch("/api/games/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            gameSummary: {
              completedAt: new Date().toISOString(),
              durationMs: timeMs,
              gridSize: duel.grid_size,
              difficulty: duel.difficulty,
              totalTiles,
              accuracy,
              mistakes,
              avgReactionTimeMs: avg,
              fastestMs: min,
              slowestMs: max,
              consistencyScore: std,
              score,
              duelId,
            },
            gridSize: duel.grid_size,
            difficulty: duel.difficulty,
            totalTiles,
            mistakes,
            elapsed: timeMs,
            score,
            mode: "number",
            accuracy,
            country,
            fastestMs: min,
            avgMs: avg,
            slowestMs: max,
          }),
        });
        const json = await res.json();
        gameId = json.gameId ?? null;
      } catch {
        // best-effort — the duel result itself still gets recorded below
      }

      fetch(`/api/duels/${duelId}/finish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, timeMs, score, accuracy, mistakes, gameId }),
      }).catch(() => toast.error("Failed to submit your time — try refreshing."));
    },
    [duel, boardNumbers.length, mistakes, userId, duelId, country],
  );

  const handleTileClick = (num) => {
    if (!gameStarted || myFinished) return;
    const now = Date.now();
    const correct = num === nextTarget;
    const timeTakenMs = now - (lastClickTimeRef.current ?? now);

    if (!correct) {
      setMistakes((m) => m + 1);
      return;
    }

    lastClickTimeRef.current = now;
    const newClickData = [...clickData, { timeTakenMs }];
    setClickData(newClickData);

    const updated = [...clickedNumbers, num];
    setClickedNumbers(updated);

    if (updated.length === boardNumbers.length) {
      finishRace(newClickData);
    }
  };

  const opponentFinishedAt = isChallenger ? duel?.opponent_finished_at : duel?.challenger_finished_at;

  if (!userId) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <p className="text-sm text-muted-foreground">Log in to enter this duel.</p>
      </div>
    );
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground text-center py-16">Loading duel...</p>;
  }

  if (!duel) {
    return <p className="text-sm text-muted-foreground text-center py-16">Duel not found.</p>;
  }

  if (duel.status === "pending") {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-3">
        <p className="text-sm font-medium text-foreground">
          Waiting for your opponent to accept this challenge.
        </p>
        <Button variant="outline" render={<Link href="/duels" />} nativeButton={false}>
          Back to Duels
        </Button>
      </div>
    );
  }

  if (["declined", "expired"].includes(duel.status)) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-3">
        <p className="text-sm font-medium text-foreground">This duel is no longer active.</p>
        <Button variant="outline" render={<Link href="/duels" />} nativeButton={false}>
          Back to Duels
        </Button>
      </div>
    );
  }

  // ── Completed — results screen ───────────────────────────────────────────
  if (duel.status === "completed") {
    const won = duel.winner_id === userId;
    const tied = !duel.winner_id;
    const myTime = isChallenger ? duel.challenger_time_ms : duel.opponent_time_ms;
    const theirTime = isChallenger ? duel.opponent_time_ms : duel.challenger_time_ms;
    const myAccuracy = isChallenger ? duel.challenger_accuracy : duel.opponent_accuracy;
    const theirAccuracy = isChallenger ? duel.opponent_accuracy : duel.challenger_accuracy;
    const myMistakes = isChallenger ? duel.challenger_mistakes : duel.opponent_mistakes;
    const theirMistakes = isChallenger ? duel.opponent_mistakes : duel.challenger_mistakes;
    const myScore = isChallenger ? duel.challenger_score : duel.opponent_score;
    const theirScore = isChallenger ? duel.opponent_score : duel.challenger_score;

    const chartData = [
      { name: "You", time: myTime != null ? myTime / 1000 : 0, fill: won ? "var(--success)" : "var(--primary)" },
      {
        name: opponent?.name || "Opponent",
        time: theirTime != null ? theirTime / 1000 : 0,
        fill: !won && !tied ? "var(--success)" : "var(--muted-foreground)",
      },
    ];

    const statRows = [
      { label: "Time", mine: fmtSeconds(myTime), theirs: fmtSeconds(theirTime) },
      {
        label: "Accuracy",
        mine: myAccuracy != null ? `${myAccuracy}%` : "—",
        theirs: theirAccuracy != null ? `${theirAccuracy}%` : "—",
      },
      { label: "Mistakes", mine: myMistakes ?? "—", theirs: theirMistakes ?? "—" },
      { label: "Score", mine: myScore ?? "—", theirs: theirScore ?? "—" },
    ];

    return (
      <div className="max-w-lg mx-auto px-4 py-10 space-y-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <span
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              tied ? "bg-muted" : won ? "bg-success/15" : "bg-destructive/15"
            }`}
          >
            <Trophy className={tied ? "text-muted-foreground" : won ? "text-success" : "text-destructive"} size={28} />
          </span>
          <h1 className="text-2xl font-bold text-foreground">
            {tied ? "It's a tie!" : won ? "You won!" : "You lost"}
          </h1>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            {duel.grid_size}×{duel.grid_size} · {duel.difficulty} · Number
          </p>
          {duel.ended_reason === "forfeit" && (
            <p className="text-sm text-muted-foreground">
              {won ? `${opponent?.name || "Your opponent"} left the game.` : "You left the game early."}
            </p>
          )}
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}s`}
                />
                <Tooltip
                  formatter={(v) => [`${Number(v).toFixed(2)}s`, "Time"]}
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                />
                <Bar dataKey="time" radius={[6, 6, 0, 0]} maxBarSize={64}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 space-y-2">
            <div className="grid grid-cols-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground pb-2 border-b border-border">
              <span></span>
              <span className="text-center">You</span>
              <span className="text-center truncate">{opponent?.name || "Opponent"}</span>
            </div>
            {statRows.map((row) => (
              <div key={row.label} className="grid grid-cols-3 items-center text-sm">
                <span className="text-muted-foreground text-xs text-left">{row.label}</span>
                <span className="text-center font-bold text-foreground">{row.mine}</span>
                <span className="text-center font-bold text-foreground">{row.theirs}</span>
              </div>
            ))}
          </div>
        </div>

        {!isProUser && <DuelProUpsell user={user?.user} />}

        <Button render={<Link href="/duels" />} nativeButton={false} className="gap-1.5">
          <ArrowLeft size={15} /> Back to Duels
        </Button>
      </div>
    );
  }

  // ── Pre-race: ready check ────────────────────────────────────────────────
  if (!gameStarted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-10 space-y-6 text-center">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            {duel.grid_size}×{duel.grid_size} · {duel.difficulty} · Number
          </p>
          <h1 className="text-xl font-bold text-foreground mt-1">
            Duel vs {opponent?.name || "Opponent"}
          </h1>
        </div>

        {countdown != null ? (
          <div className="py-10">
            <p className="text-6xl font-black text-primary">{countdown}</p>
            <p className="text-sm text-muted-foreground mt-2">Get ready...</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Users size={15} />
              {opponentPresent ? "Opponent is here" : "Waiting for opponent to join..."}
            </div>
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">You</p>
                <p className={`text-sm font-bold ${myReady ? "text-success" : "text-muted-foreground"}`}>
                  {myReady ? "Ready" : "Connecting..."}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">{opponent?.name || "Opponent"}</p>
                <p className={`text-sm font-bold ${opponentReady ? "text-success" : "text-muted-foreground"}`}>
                  {opponentReady ? "Ready" : "Waiting..."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Live race ─────────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-foreground">
          {myFinished ? `Done — ${fmtSeconds(myTimeMs)}` : "Go!"}
        </p>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Flag size={13} className={opponentFinishedAt ? "text-success" : ""} />
          {opponentFinishedAt ? `${opponent?.name || "Opponent"} finished` : "Opponent racing..."}
        </div>
      </div>

      {myFinished ? (
        <div className="text-center py-10">
          <p className="text-sm text-muted-foreground">
            Waiting for {opponent?.name || "your opponent"} to finish...
          </p>
        </div>
      ) : (
        <BoardGrid
          numbers={boardNumbers}
          gridSize={duel.grid_size}
          onClick={handleTileClick}
          gameStarted={gameStarted}
          clickedNumbers={clickedNumbers}
          loading={false}
        />
      )}
    </div>
  );
}
