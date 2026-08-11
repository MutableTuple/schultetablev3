import React, { memo } from "react";

/**
 * `label` names the board the player is about to get — "Start 4×4 Hard"
 * rather than a generic "Start game".
 *
 * The adaptive engine already picks the next grid/difficulty/mode after every
 * round, but it did that silently: the button said the same thing every time,
 * so the step up was invisible and read as "play the same thing again". Naming
 * it turns the button itself into the between-games reward, which is what lets
 * the results popup move to once every five rounds instead of after each one.
 *
 * `sub` carries the one-line reason ("You earned this step up").
 *
 * `loading` shows a mini spinner *inside* this button rather than swapping it
 * for a different element. The previous approach replaced the whole button
 * with a "Preparing board..." pill — a different size, shape and colour — so
 * every board generation produced a visible layout jump and the label the
 * player was reading vanished mid-glance. Keeping one element and dimming it
 * means the button never moves and the next board stays named while it loads.
 *
 * memo'd because SchulteTable re-renders on every tile tap during a round;
 * this sits outside the board but would otherwise re-render with it. Props are
 * primitives, so the shallow compare is exact.
 */
function StartBtn({ label = "Start game", sub = null, loading = false }) {
  return (
    <div
      aria-busy={loading || undefined}
      className={`
        relative select-none border border-primary/40 bg-primary/80 px-7 py-2
        text-center font-semibold text-base-100 transition-colors duration-300
        ${
          loading
            ? "cursor-wait opacity-70"
            : "cursor-pointer hover:border-primary hover:bg-primary/90"
        }
      `}
    >
      {/* Absolutely positioned, so showing it can't change the button's width.
          An inline spinner widened the button by ~20px every time a board
          regenerated — a visible jump on the element the player is about to
          aim at. The px-7 above reserves the gutter it sits in, in both
          states, so the resting and loading widths are identical. */}
      {loading && (
        /* Inline SVG rather than lucide's <Loader2>: this is the only icon the
           pre-game screen needs, and a hand-rolled one keeps an icon module
           off the path that renders before every round. currentColor keeps it
           correct in both themes. */
        <svg
          className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="3"
            opacity="0.25"
          />
          <path
            d="M21 12a9 9 0 0 0-9-9"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      )}
      <span className="block leading-tight">{label}</span>
      {/* Gated on `sub`, not on `sub || loading`. Rendering this line *only*
          while loading added a second row and grew the button 38px → 53px
          mid-interaction. From game two onward `sub` always exists (the
          adaptive engine's reason line), so the row is present in both states
          and only its text swaps — no reflow. Before the first game there's no
          sub, and the spinner alone carries the loading state. */}
      {sub && (
        <span className="mt-0.5 block text-[10px] font-medium leading-tight opacity-80">
          {loading ? "Preparing board…" : sub}
        </span>
      )}
    </div>
  );
}

export default memo(StartBtn);
