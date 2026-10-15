import assert from "node:assert/strict";
import test from "node:test";
import {
  createInitialNflGamesState,
  createNflGamesStateFromPayload,
} from "./useNflGames.js";

test("starts in the loading state without games", () => {
  assert.deepEqual(createInitialNflGamesState(), {
    status: "loading",
    games: [],
    stale: false,
    warning: null,
    error: null,
    lastUpdated: null,
  });
});

test("treats a successful response with games as success", () => {
  const state = createNflGamesStateFromPayload({
    games: [{ id: "game-1" }],
    stale: false,
    updatedAt: "2026-10-15T20:00:00.000Z",
  });

  assert.equal(state.status, "success");
  assert.equal(state.games.length, 1);
  assert.equal(state.stale, false);
});

test("treats a successful response without games as empty", () => {
  const state = createNflGamesStateFromPayload({ games: [] });

  assert.equal(state.status, "empty");
  assert.deepEqual(state.games, []);
});

test("preserves the server's stale warning", () => {
  const state = createNflGamesStateFromPayload({
    games: [{ id: "game-1" }],
    stale: true,
    warning: "Game data may be delayed",
  });

  assert.equal(state.status, "success");
  assert.equal(state.stale, true);
  assert.equal(state.warning, "Game data may be delayed");
});
