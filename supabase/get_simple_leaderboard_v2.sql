-- Fixes leaderboard pagination.
--
-- WHAT WAS WRONG
--   1. The fast path (no filters) had no LIMIT/OFFSET whatsoever, so it
--      returned every row — capped at 1000 only by PostgREST's max-rows
--      default. That is the branch the leaderboard uses by default, so every
--      page rendered the same first 10 rows client-side.
--   2. The filter path applied LIMIT/OFFSET *inside* the subquery, then the
--      outer ORDER BY re-sorted whatever survived. ORDER BY inside a UNION ALL
--      branch is also not guaranteed to be preserved through the union in
--      Postgres, so that inner ordering was unreliable.
--
-- WHAT CHANGED
--   · Both branches now feed a single CTE; ordering, LIMIT and OFFSET are
--     applied exactly once, at the end, over the combined set.
--   · Added `total_count` via count(*) OVER (). Window functions are evaluated
--     before LIMIT, so this is the full matching row count, not the page size.
--     The client needs it to know how many pages exist.
--
-- COMPATIBILITY
--   Adding a column to RETURNS TABLE is additive — existing callers that read
--   fields by name are unaffected. The client is written to work against both
--   the old and new function: if `total_count` is present it uses server-side
--   paging, otherwise it falls back to slicing locally.

CREATE OR REPLACE FUNCTION public.get_simple_leaderboard_v2(
  p_grid_size   integer   DEFAULT NULL::integer,
  p_difficulty  text      DEFAULT NULL::text,
  p_game_mode   text      DEFAULT NULL::text,
  p_date_filter timestamp without time zone DEFAULT NULL::timestamp without time zone,
  p_limit       integer   DEFAULT 10,
  p_offset      integer   DEFAULT 0
)
RETURNS TABLE(
  user_id            uuid,
  name               text,
  username           text,
  image              text,
  total_score        bigint,
  total_games        integer,
  avg_accuracy       double precision,
  total_wrong_clicks bigint,
  total_right_clicks bigint,
  total_count        bigint
)
LANGUAGE sql
STABLE
AS $function$

with base as (

  /* ---------------------------------------------------------------
     FAST MODE — no filters, read from the cached stats table.
     --------------------------------------------------------------- */
  select
    s.user_id,
    u.name,
    u.username,
    u.image,
    s.total_score,
    s.total_games,
    round(s.avg_accuracy::numeric, 2)::double precision as avg_accuracy,
    s.total_wrong_clicks,
    s.total_right_clicks
  from "UserLeaderboardStats" s
  join "User" u
    on u.id = s.user_id
  where
    p_grid_size   is null
    and p_difficulty  is null
    and p_game_mode   is null
    and p_date_filter is null

  union all

  /* ---------------------------------------------------------------
     FILTER MODE — any filter set, aggregate from the raw table.
     No LIMIT here: it has to rank the whole matching set before the
     page can be taken, and the outer query does that now.
     --------------------------------------------------------------- */
  select
    r.user_id,
    u.name,
    u.username,
    u.image,
    r.total_score,
    r.total_games,
    r.avg_accuracy,
    r.total_wrong_clicks,
    r.total_right_clicks
  from (
    select
      gs.user_id,
      sum(gs.score)::bigint                     as total_score,
      count(*)::int                             as total_games,
      avg(gs.accuracy)::double precision        as avg_accuracy,
      sum(gs.total_wrong_click)::bigint         as total_wrong_clicks,
      sum(gs.total_right_click)::bigint         as total_right_clicks
    from "UniversalGameStats" gs
    where
      gs.user_id is not null
      and (
        p_grid_size   is not null
        or p_difficulty  is not null
        or p_game_mode   is not null
        or p_date_filter is not null
      )
      and (p_grid_size   is null or gs.grid_size  = p_grid_size)
      and (p_difficulty  is null or gs.difficulty = p_difficulty)
      and (p_game_mode   is null or gs.game_mode  = p_game_mode)
      and (p_date_filter is null or gs.created_at >= p_date_filter)
    group by gs.user_id
  ) r
  join "User" u
    on u.id = r.user_id
)

select
  b.user_id,
  b.name,
  b.username,
  b.image,
  b.total_score,
  b.total_games,
  b.avg_accuracy,
  b.total_wrong_clicks,
  b.total_right_clicks,
  count(*) over () as total_count
from base b
order by b.total_score desc, b.total_games desc
limit  coalesce(p_limit, 10)
offset coalesce(p_offset, 0);

$function$;
