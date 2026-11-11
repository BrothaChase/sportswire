import { useCallback, useEffect, useRef, useState } from "react";

export function createInitialNflGamesState() {
  return {
    status: "loading",
    games: [],
    stale: false,
    warning: null,
    error: null,
    lastUpdated: null,
  };
}

export function createNflGamesStateFromPayload(payload) {
  const games = Array.isArray(payload.games) ? payload.games : [];

  return {
    status: games.length > 0 ? "success" : "empty",
    games,
    stale: Boolean(payload.stale),
    warning: payload.warning ?? null,
    error: null,
    lastUpdated: payload.updatedAt ?? null,
  };
}

export function useNflGames({ season, week, enabled = true }) {
  const [requestState, setRequestState] = useState(createInitialNflGamesState);
  const activeRequest = useRef(null);
  const activeQuery = useRef(null);

  const loadGames = useCallback(async () => {
    if (!enabled) return;
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;
    const queryKey = `${season}:${week}`;
    const queryChanged = activeQuery.current !== queryKey;
    activeQuery.current = queryKey;

    // A failed refresh may keep this week's games, never a different week's.
    setRequestState((current) => queryChanged
      ? createInitialNflGamesState()
      : { ...current, status: current.games.length > 0 ? "refreshing" : "loading", error: null });

    try {
      const searchParams = new URLSearchParams({
        season: String(season),
        week: String(week),
      });
      const response = await fetch(`/api/nfl/games?${searchParams}`, {
        signal: controller.signal,
      });
      const payload = await response.json().catch(() => ({}));
      if (controller.signal.aborted) return;

      if (!response.ok) {
        throw new Error(payload.error || "Unable to load NFL games");
      }

      setRequestState(createNflGamesStateFromPayload(payload));
    } catch (error) {
      if (controller.signal.aborted) return;

      setRequestState((current) => {
        if (current.games.length > 0) {
          return {
            ...current,
            status: "success",
            stale: true,
            warning: "Game data may be delayed. Refresh failed.",
            error: null,
          };
        }

        return {
          ...createInitialNflGamesState(),
          status: "error",
          error: error.message,
        };
      });
    } finally {
      if (activeRequest.current === controller) {
        activeRequest.current = null;
      }
    }
  }, [season, week, enabled]);

  useEffect(() => {
    if (!enabled) return;
    loadGames();
    const refresh = window.setInterval(() => {
      if (document.visibilityState === "visible" && !activeRequest.current) loadGames();
    }, 60_000);
    return () => {
      window.clearInterval(refresh);
      activeRequest.current?.abort();
    };
  }, [loadGames, enabled]);

  return {
    ...requestState,
    retry: loadGames,
  };
}
