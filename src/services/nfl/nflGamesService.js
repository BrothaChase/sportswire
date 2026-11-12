import { TtlCache } from "../ttlCache.js";

export function createNflGamesService({
  provider,
  cache = new TtlCache(),
  ttlMs = 30_000,
  now = Date.now,
} = {}) {
  const inFlightRequests = new Map();

  async function refreshGames(cacheKey, query, cached) {
    try {
      const games = await provider.getGames(query);
      const result = {
        season: query.season,
        week: query.week,
        games,
        source: "balldontlie",
        updatedAt: new Date(now()).toISOString(),
      };

      cache.set(cacheKey, result, ttlMs);
      return { ...result, stale: false, cacheStatus: "miss" };
    } catch (error) {
      if (cached) {
        return {
          ...cached.value,
          stale: true,
          cacheStatus: "stale",
          warning: "Live data is temporarily unavailable. Showing the last successful update.",
        };
      }
      throw error;
    }
  }

  return {
    async getGames(query) {
      const cacheKey = `${query.season}:${query.week}`;
      const cached = cache.get(cacheKey);

      if (cached?.isFresh) {
        return { ...cached.value, stale: false, cacheStatus: "hit" };
      }

      if (!inFlightRequests.has(cacheKey)) {
        const refresh = refreshGames(cacheKey, query, cached)
          .finally(() => inFlightRequests.delete(cacheKey));
        inFlightRequests.set(cacheKey, refresh);
      }

      return inFlightRequests.get(cacheKey);
    },
  };
}
