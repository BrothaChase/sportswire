import { useCallback, useEffect, useRef, useState } from "react";

// Provides a consistent starting point for initial loads and no-data errors.
export function createInitialNbaGamesState() {
  return {
    status: "loading",
    games: [],
    stale: false,
    warning: null,
    error: null,
    lastUpdated: null,
  };
}

// Converts the server response into the state shape consumed by NBA pages.
export function createNbaGamesStateFromPayload(payload) {
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

export function useNbaGames({ date, enabled = true }) {
  const [requestState, setRequestState] = useState(createInitialNbaGamesState);

  // Refs track request activity without causing extra renders.
  const activeRequest = useRef(null);
  const activeQuery = useRef(null);

  const loadGames = useCallback(async () => {
    if (!enabled) return;

    // Cancel the previous request so an older response cannot replace newer data.
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;
    const queryKey = date;
    const queryChanged = activeQuery.current !== queryKey;
    activeQuery.current = queryKey;

    // Keep games during same-date refreshes, but clear games from a different date.
    setRequestState((current) =>
      queryChanged
        ? createInitialNbaGamesState()
        : {
            ...current,
            status: current.games.length > 0 ? "refreshing" : "loading",
            error: null,
          },
    );

    try {
      // The Express route accepts one ISO date and returns normalized NBA games.
      const searchParams = new URLSearchParams({ date });
      const response = await fetch(`/api/nba/games?${searchParams}`, {
        signal: controller.signal,
      });
      const payload = await response.json().catch(() => ({}));
      if (controller.signal.aborted) return;

      if (!response.ok) {
        throw new Error(payload.error || "Unable to load NBA games");
      }

      setRequestState(createNbaGamesStateFromPayload(payload));
    } catch (error) {
      if (controller.signal.aborted) return;

      // Existing games remain useful as stale data; otherwise show an error.
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
          ...createInitialNbaGamesState(),
          status: "error",
          error: error.message,
        };
      });
    } finally {
      if (activeRequest.current === controller) {
        activeRequest.current = null;
      }
    }
  }, [date, enabled]);

  useEffect(() => {
    if (!enabled) return;
    loadGames();

    // Refresh visible tabs on the same 30-second schedule as the server cache.
    const refresh = window.setInterval(() => {
      if (document.visibilityState === "visible" && !activeRequest.current) {
        loadGames();
      }
    }, 30_000);

    // Stop scheduled work and pending requests when dependencies change or unmount.
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
