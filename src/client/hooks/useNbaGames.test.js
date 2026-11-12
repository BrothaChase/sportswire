import assert from "node:assert/strict";
import test from "node:test";
import {
  createInitialNbaGamesState,
  createNbaGamesStateFromPayload,
} from "./useNbaGames.js";

test("starts NBA games in the loading state without games", () => {
  assert.deepEqual(createInitialNbaGamesState(), {
    status: "loading",
    games: [],
    stale: false,
    warning: null,
    error: null,
    lastUpdated: null,
  });
});

test("treats an NBA response with games as success", () => {
  const state = createNbaGamesStateFromPayload({
    games: [{ id: "bdl-nba-1" }],
    stale: false,
    updatedAt: "2026-11-12T20:00:00.000Z",
  });

  assert.equal(state.status, "success");
  assert.equal(state.games.length, 1);
  assert.equal(state.stale, false);
  assert.equal(state.lastUpdated, "2026-11-12T20:00:00.000Z");
});

test("treats an NBA response without games as empty", () => {
  const state = createNbaGamesStateFromPayload({ games: [] });

  assert.equal(state.status, "empty");
  assert.deepEqual(state.games, []);
});

test("preserves the NBA server's stale warning", () => {
  const state = createNbaGamesStateFromPayload({
    games: [{ id: "bdl-nba-1" }],
    stale: true,
    warning: "Game data may be delayed",
  });

  assert.equal(state.status, "success");
  assert.equal(state.stale, true);
  assert.equal(state.warning, "Game data may be delayed");
  assert.equal(state.error, null);
});
