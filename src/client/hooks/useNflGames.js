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

export function useNflGames({ season, week }) {
  const [requestState, setRequestState] = useState(createInitialNflGamesState);
  const activeRequest = useRef(null);

  const loadGames = useCallback(async () => {
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;

    setRequestState((current) => ({
      ...current,
      status: current.games.length > 0 ? "refreshing" : "loading",
      error: null,
    }));

    try {
      const searchParams = new URLSearchParams({
        season: String(season),
        week: String(week),
      });
      const response = await fetch(`/api/nfl/games?${searchParams}`, {
        signal: controller.signal,
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error || "Unable to load NFL games");
      }

      setRequestState(createNflGamesStateFromPayload(payload));
    } catch (error) {
      if (error.name === "AbortError") return;

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
  }, [season, week]);

  useEffect(() => {
    loadGames();
    return () => activeRequest.current?.abort();
  }, [loadGames]);

  return {
    ...requestState,
    retry: loadGames,
  };
}
