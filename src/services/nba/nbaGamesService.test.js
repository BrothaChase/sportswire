import assert from "node:assert/strict";
import test from "node:test";
import { TtlCache } from "../ttlCache.js";
import { createNbaGamesService } from "./nbaGamesService.js";

test("reuses fresh NBA games for the same date", async () => {
  let providerCalls = 0;
  let currentTime = 1_000;
  const provider = {
    async getGames() {
      providerCalls += 1;
      return [{ id: "bdl-nba-game-1" }];
    },
  };
  const now = () => currentTime;
  const service = createNbaGamesService({
    provider,
    cache: new TtlCache({ now }),
    now,
    ttlMs: 30_000,
  });

  const first = await service.getGames({ date: "2026-11-12" });
  currentTime += 10_000;
  const second = await service.getGames({ date: "2026-11-12" });

  assert.equal(providerCalls, 1);
  assert.equal(first.cacheStatus, "miss");
  assert.equal(second.cacheStatus, "hit");
  assert.equal(second.stale, false);
  assert.equal(second.date, "2026-11-12");
});

test("returns stale NBA games when a refresh fails", async () => {
  let shouldFail = false;
  let currentTime = 1_000;
  const provider = {
    async getGames() {
      if (shouldFail) throw new Error("provider offline");
      return [{ id: "bdl-nba-game-1" }];
    },
  };
  const now = () => currentTime;
  const service = createNbaGamesService({
    provider,
    cache: new TtlCache({ now }),
    now,
    ttlMs: 30_000,
  });

  await service.getGames({ date: "2026-11-12" });
  currentTime += 31_000;
  shouldFail = true;
  const result = await service.getGames({ date: "2026-11-12" });

  assert.equal(result.stale, true);
  assert.equal(result.cacheStatus, "stale");
  assert.equal(result.games[0].id, "bdl-nba-game-1");
  assert.match(result.warning, /last successful update/i);
});

test("deduplicates simultaneous NBA requests for the same date", async () => {
  let providerCalls = 0;
  const provider = {
    async getGames() {
      providerCalls += 1;
      await new Promise((resolve) => setTimeout(resolve, 10));
      return [{ id: "bdl-nba-game-1" }];
    },
  };
  const service = createNbaGamesService({ provider });

  await Promise.all([
    service.getGames({ date: "2026-11-12" }),
    service.getGames({ date: "2026-11-12" }),
  ]);

  assert.equal(providerCalls, 1);
});

test("uses separate cache entries for different NBA dates", async () => {
  const requestedDates = [];
  const provider = {
    async getGames({ date }) {
      requestedDates.push(date);
      return [{ id: `game-${date}` }];
    },
  };
  const service = createNbaGamesService({ provider });

  const first = await service.getGames({ date: "2026-11-12" });
  const second = await service.getGames({ date: "2026-11-13" });

  assert.deepEqual(requestedDates, ["2026-11-12", "2026-11-13"]);
  assert.equal(first.games[0].id, "game-2026-11-12");
  assert.equal(second.games[0].id, "game-2026-11-13");
});
