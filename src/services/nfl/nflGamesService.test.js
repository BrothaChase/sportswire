import assert from "node:assert/strict";
import test from "node:test";
import { createNflGamesService } from "./nflGamesService.js";
import { TtlCache } from "../ttlCache.js";

test("reuses fresh data without calling the provider again", async () => {
  let providerCalls = 0;
  let currentTime = 1_000;
  const provider = {
    async getGames() {
      providerCalls += 1;
      return [{ id: "game-1" }];
    },
  };
  const now = () => currentTime;
  const service = createNflGamesService({ provider, cache: new TtlCache({ now }), now, ttlMs: 30_000 });

  const first = await service.getGames({ season: 2026, week: 6 });
  currentTime += 10_000;
  const second = await service.getGames({ season: 2026, week: 6 });

  assert.equal(providerCalls, 1);
  assert.equal(first.cacheStatus, "miss");
  assert.equal(second.cacheStatus, "hit");
  assert.equal(second.stale, false);
});

test("returns stale data when a refresh fails", async () => {
  let shouldFail = false;
  let currentTime = 1_000;
  const provider = {
    async getGames() {
      if (shouldFail) throw new Error("provider offline");
      return [{ id: "game-1" }];
    },
  };
  const now = () => currentTime;
  const service = createNflGamesService({ provider, cache: new TtlCache({ now }), now, ttlMs: 30_000 });

  await service.getGames({ season: 2026, week: 6 });
  currentTime += 31_000;
  shouldFail = true;
  const result = await service.getGames({ season: 2026, week: 6 });

  assert.equal(result.stale, true);
  assert.equal(result.cacheStatus, "stale");
  assert.equal(result.games[0].id, "game-1");
  assert.match(result.warning, /last successful update/i);
});

test("deduplicates simultaneous requests for the same week", async () => {
  let providerCalls = 0;
  const provider = {
    async getGames() {
      providerCalls += 1;
      await new Promise((resolve) => setTimeout(resolve, 10));
      return [{ id: "game-1" }];
    },
  };
  const service = createNflGamesService({ provider });

  await Promise.all([
    service.getGames({ season: 2026, week: 6 }),
    service.getGames({ season: 2026, week: 6 }),
  ]);

  assert.equal(providerCalls, 1);
});
