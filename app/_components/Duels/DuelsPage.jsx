"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Swords, LogIn, Check, X, Trophy, Plus, Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const GRID_SIZES = [3, 4, 5, 6];
const DIFFICULTIES = ["Easy", "Medium", "Hard", "Extreme", "Impossible"];
// Live duels currently only support Number mode — the shared board needs a
// generator per mode, and only Number's (a plain shuffled 1..N sequence)
// is implemented server-side so far.
const GAME_MODE = "number";

function StatusBadge({ status }) {
  const map = {
    pending: { label: "Pending", cls: "bg-warning/15 text-warning" },
    active: { label: "Ready to Play", cls: "bg-primary/15 text-primary" },
    in_progress: { label: "In Progress", cls: "bg-primary/15 text-primary" },
    completed: { label: "Completed", cls: "bg-success/15 text-success" },
    declined: { label: "Declined", cls: "bg-destructive/15 text-destructive" },
    expired: { label: "Expired", cls: "bg-muted text-muted-foreground" },
  };
  const s = map[status] ?? map.pending;
  return <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${s.cls}`}>{s.label}</span>;
}

function DuelMeta({ duel }) {
  return (
    <span className="text-xs text-muted-foreground">
      {duel.grid_size}×{duel.grid_size} · {duel.difficulty} · Number
    </span>
  );
}

export default function DuelsPage({ user }) {
  const userId = user?.user?.id ?? null;
  const [duels, setDuels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [opponentUsername, setOpponentUsername] = useState("");
  const [gridSize, setGridSize] = useState(4);
  const [difficulty, setDifficulty] = useState("Medium");

  const [showAutoDuel, setShowAutoDuel] = useState(false);
  const [autoGridSize, setAutoGridSize] = useState(4);
  const [autoDifficulty, setAutoDifficulty] = useState("Medium");
  const [searching, setSearching] = useState(false);
  const pollTimerRef = useRef(null);

  const fetchDuels = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/duels?userId=${userId}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load duels");
      setDuels(json.duels ?? []);
    } catch (err) {
      toast.error(err.message || "Failed to load duels");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchDuels();
  }, [fetchDuels]);

  const createDuel = async () => {
    if (!opponentUsername.trim()) {
      toast.error("Enter an opponent's username");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/duels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengerId: userId,
          opponentUsername: opponentUsername.trim(),
          gridSize,
          difficulty,
          gameMode: GAME_MODE,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to create duel");
      toast.success(`Challenge sent to @${opponentUsername.trim()}`);
      setOpponentUsername("");
      setShowForm(false);
      fetchDuels();
    } catch (err) {
      toast.error(err.message || "Failed to create duel");
    } finally {
      setCreating(false);
    }
  };

  const respondToDuel = async (duelId, action) => {
    try {
      const res = await fetch(`/api/duels/${duelId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Action failed");
      toast.success(action === "accept" ? "Duel accepted — good luck!" : "Duel declined");
      fetchDuels();
    } catch (err) {
      toast.error(err.message || "Action failed");
    }
  };

  const stopPolling = useCallback(() => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }, []);

  useEffect(() => stopPolling, [stopPolling]);

  const pollMatchmake = useCallback(async () => {
    try {
      const res = await fetch(`/api/duels/matchmake?userId=${userId}`);
      const json = await res.json();
      if (json.matched) {
        stopPolling();
        setSearching(false);
        setShowAutoDuel(false);
        toast.success("Opponent found — duel started!");
        fetchDuels();
      }
    } catch {
      // transient — next poll tick will retry
    }
  }, [userId, stopPolling, fetchDuels]);

  const startMatchmaking = async () => {
    setSearching(true);
    try {
      const res = await fetch("/api/duels/matchmake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          gridSize: autoGridSize,
          difficulty: autoDifficulty,
          gameMode: GAME_MODE,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Matchmaking failed");
      if (json.matched) {
        setSearching(false);
        setShowAutoDuel(false);
        toast.success("Opponent found — duel started!");
        fetchDuels();
      } else {
        pollTimerRef.current = setInterval(pollMatchmake, 3000);
      }
    } catch (err) {
      setSearching(false);
      toast.error(err.message || "Matchmaking failed");
    }
  };

  const cancelMatchmaking = async () => {
    stopPolling();
    setSearching(false);
    try {
      await fetch(`/api/duels/matchmake?userId=${userId}`, { method: "DELETE" });
    } catch {
      // best-effort cleanup
    }
  };

  if (!userId) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-background px-4 text-center">
        <div className="flex flex-col items-center gap-5 max-w-sm">
          <span className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
            <LogIn className="w-6 h-6 text-muted-foreground" />
          </span>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              You&apos;re not logged in
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Please log in to challenge other players to a duel.
            </p>
          </div>
          <Button nativeButton={false} render={<Link href="/auth/login" />}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  const incoming = duels.filter((d) => d.opponent_id === userId && d.status === "pending");
  const outgoingPending = duels.filter((d) => d.challenger_id === userId && d.status === "pending");
  const live = duels.filter((d) => ["active", "in_progress"].includes(d.status));
  const completed = duels.filter((d) => d.status === "completed");
  const other = duels.filter((d) => ["declined", "expired"].includes(d.status));

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shrink-0">
            <Swords size={18} />
          </span>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Head-to-Head
            </p>
            <h1 className="text-xl font-bold tracking-tight text-foreground leading-tight">Duels</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setShowAutoDuel((v) => !v);
              setShowForm(false);
            }}
            className="gap-1.5"
          >
            <Zap size={15} /> Quick Match
          </Button>
          <Button
            onClick={() => {
              setShowForm((v) => !v);
              setShowAutoDuel(false);
            }}
            className="gap-1.5"
          >
            <Plus size={15} /> New Duel
          </Button>
        </div>
      </div>

      {showAutoDuel && (
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          {!searching ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">
                    Grid
                  </label>
                  <select
                    value={autoGridSize}
                    onChange={(e) => setAutoGridSize(Number(e.target.value))}
                    className="w-full border border-border rounded-xl px-2.5 py-2.5 text-sm text-foreground bg-muted focus:outline-none focus:border-ring"
                  >
                    {GRID_SIZES.map((g) => (
                      <option key={g} value={g}>
                        {g}×{g}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">
                    Difficulty
                  </label>
                  <select
                    value={autoDifficulty}
                    onChange={(e) => setAutoDifficulty(e.target.value)}
                    className="w-full border border-border rounded-xl px-2.5 py-2.5 text-sm text-foreground bg-muted focus:outline-none focus:border-ring"
                  >
                    {DIFFICULTIES.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We'll instantly pair you with another player waiting for this exact grid and
                difficulty — or you'll wait here until one joins. Both of you play live, at the
                same time, on the same board.
              </p>
              <Button onClick={startMatchmaking} className="w-full gap-1.5">
                <Zap size={15} /> Find Opponent
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 py-4">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <p className="text-sm text-foreground font-medium">Searching for an opponent...</p>
              <p className="text-xs text-muted-foreground text-center">
                {autoGridSize}×{autoGridSize} · {autoDifficulty} · Number
              </p>
              <Button variant="outline" size="sm" onClick={cancelMatchmaking}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      )}

      {showForm && (
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">
              Opponent Username
            </label>
            <input
              type="text"
              value={opponentUsername}
              onChange={(e) => setOpponentUsername(e.target.value)}
              placeholder="e.g. yogeshvishwakarma"
              className="w-full border border-border rounded-xl px-3 py-2.5 text-sm text-foreground bg-muted focus:outline-none focus:border-ring"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">
                Grid
              </label>
              <select
                value={gridSize}
                onChange={(e) => setGridSize(Number(e.target.value))}
                className="w-full border border-border rounded-xl px-2.5 py-2.5 text-sm text-foreground bg-muted focus:outline-none focus:border-ring"
              >
                {GRID_SIZES.map((g) => (
                  <option key={g} value={g}>
                    {g}×{g}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full border border-border rounded-xl px-2.5 py-2.5 text-sm text-foreground bg-muted focus:outline-none focus:border-ring"
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Once they accept, you'll both jump into a live {gridSize}×{gridSize} {difficulty}{" "}
            duel together — same board, same start, highest speed wins.
          </p>
          <Button onClick={createDuel} disabled={creating} className="w-full">
            {creating ? "Sending..." : "Send Challenge"}
          </Button>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground text-center py-10">Loading duels...</p>
      ) : duels.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-2xl">
          <Swords className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground">No duels yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Use Quick Match to get auto-paired, or challenge a player by username.
          </p>
        </div>
      ) : (
        <>
          <DuelSection
            title="Needs Your Response"
            duels={incoming}
            userId={userId}
            renderActions={(d) => (
              <div className="flex gap-2">
                <Button size="sm" onClick={() => respondToDuel(d.id, "accept")} className="gap-1">
                  <Check size={13} /> Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => respondToDuel(d.id, "decline")}
                  className="gap-1"
                >
                  <X size={13} /> Decline
                </Button>
              </div>
            )}
          />

          <DuelSection title="Waiting for Opponent to Accept" duels={outgoingPending} userId={userId} />

          <DuelSection
            title="Live Duels"
            duels={live}
            userId={userId}
            renderActions={(d) => (
              <Button size="sm" nativeButton={false} render={<Link href={`/duels/${d.id}`} />} className="gap-1.5">
                <Zap size={13} /> Enter Duel
              </Button>
            )}
          />

          <DuelSection
            title="Completed"
            duels={completed}
            userId={userId}
            renderExtra={(d) => {
              const won = d.winner_id === userId;
              const tied = !d.winner_id;
              const isChallenger = d.challenger_id === userId;
              const myTime = isChallenger ? d.challenger_time_ms : d.opponent_time_ms;
              const theirTime = isChallenger ? d.opponent_time_ms : d.challenger_time_ms;
              return (
                <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold">
                  <Trophy
                    size={13}
                    className={tied ? "text-muted-foreground" : won ? "text-success" : "text-destructive"}
                  />
                  <span className={tied ? "text-muted-foreground" : won ? "text-success" : "text-destructive"}>
                    {tied ? "Tied" : won ? "You won" : "You lost"}
                  </span>
                  <span className="text-muted-foreground font-normal">
                    · {myTime != null ? `${(myTime / 1000).toFixed(2)}s` : "—"} vs{" "}
                    {theirTime != null ? `${(theirTime / 1000).toFixed(2)}s` : "—"}
                    {d.ended_reason === "forfeit" ? " · forfeit" : ""}
                  </span>
                </div>
              );
            }}
          />

          {other.length > 0 && <DuelSection title="Past Duels" duels={other} userId={userId} muted />}
        </>
      )}
    </div>
  );
}

function DuelSection({ title, duels, userId, renderActions, renderExtra, muted }) {
  if (!duels || duels.length === 0) return null;
  return (
    <div className="space-y-3">
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest px-1">{title}</p>
      <div className="space-y-2.5">
        {duels.map((d) => {
          const isChallenger = d.challenger_id === userId;
          const other = isChallenger ? d.opponent : d.challenger;
          return (
            <div key={d.id} className={`bg-card border border-border rounded-2xl p-4 ${muted ? "opacity-60" : ""}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-foreground shrink-0 overflow-hidden">
                    {other?.image ? (
                      <img src={other.image} alt={other?.name || "opponent"} className="w-full h-full object-cover" />
                    ) : (
                      (other?.name?.[0] || "?").toUpperCase()
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">
                      {isChallenger ? "vs" : "Challenge from"} {other?.name || d.opponent_username || "Unknown"}
                    </p>
                    <DuelMeta duel={d} />
                  </div>
                </div>
                <StatusBadge status={d.status} />
              </div>
              {renderExtra && renderExtra(d)}
              {renderActions && <div className="mt-3">{renderActions(d)}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
