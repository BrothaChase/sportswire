import assert from "node:assert/strict";
import test from "node:test";
import {
  createBallDontLieNbaProvider,
  normalizeBallDontLieNbaGame,
} from "./ballDontLieProvider.js";

function createProviderGame(overrides = {}) {
  return {
    id: 15907925,
    datetime: "2026-11-12T01:00:00.000Z",
    status: "3rd Qtr",
    status_state: "in_progress",
    period: 3,
    time: "4:18",
    visitor_team_score: 77,
    home_team_score: 81,
    visitor_team: {
      id: 20,
      abbreviation: "NYK",
      city: "New York",
      name: "Knicks",
      full_name: "New York Knicks",
    },
    home_team: {
      id: 2,
      abbreviation: "BOS",
      city: "Boston",
      name: "Celtics",
      full_name: "Boston Celtics",
    },
    ...overrides,
  };
}

test("normalizes an NBA game into the SportsWire game shape", () => {
  const game = normalizeBallDontLieNbaGame(createProviderGame());

  assert.deepEqual(game, {
    id: "bdl-nba-15907925",
    providerId: 15907925,
    scheduledAt: "2026-11-12T01:00:00.000Z",
    status: "live",
    statusLabel: "3rd Qtr",
    clock: "4:18",
    period: 3,
    awayTeam: {
      id: "NYK",
      providerId: 20,
      abbreviation: "NYK",
      city: "New York",
      name: "Knicks",
      fullName: "New York Knicks",
      color: "#006bb6",
    },
    homeTeam: {
      id: "BOS",
      providerId: 2,
      abbreviation: "BOS",
      city: "Boston",
      name: "Celtics",
      fullName: "Boston Celtics",
      color: "#007a33",
    },
    awayScore: 77,
    homeScore: 81,
  });
});

test("normalizes lifecycle statuses and blank clocks", () => {
  const cases = [
    ["scheduled", "upcoming"],
    ["in_progress", "live"],
    ["final", "final"],
    ["postponed", "postponed"],
    ["unknown", "unavailable"],
  ];

  for (const [providerStatus, expectedStatus] of cases) {
    const game = normalizeBallDontLieNbaGame(
      createProviderGame({ status_state: providerStatus, time: " " }),
    );

    assert.equal(game.status, expectedStatus);
    assert.equal(game.clock, null);
  }
});

test("requests one date with authorization and normalizes the response", async () => {
  let requestedUrl;
  let requestedOptions;
  const fetchImpl = async (url, options) => {
    requestedUrl = url;
    requestedOptions = options;
    return {
      ok: true,
      async json() {
        return { data: [createProviderGame()] };
      },
    };
  };
  const provider = createBallDontLieNbaProvider({
    apiKey: "test-key",
    baseUrl: "https://example.test/nba/",
    fetchImpl,
  });

  const games = await provider.getGames({ date: "2026-11-12" });

  assert.equal(requestedUrl.origin, "https://example.test");
  assert.equal(requestedUrl.pathname, "/nba/games");
  assert.equal(requestedUrl.searchParams.get("dates[]"), "2026-11-12");
  assert.equal(requestedUrl.searchParams.get("per_page"), "100");
  assert.equal(requestedOptions.headers.Authorization, "test-key");
  assert.equal(games[0].id, "bdl-nba-15907925");
});

test("rejects an unexpected provider response", async () => {
  const provider = createBallDontLieNbaProvider({
    apiKey: "test-key",
    fetchImpl: async () => ({
      ok: true,
      async json() {
        return { data: null };
      },
    }),
  });

  await assert.rejects(
    provider.getGames({ date: "2026-11-12" }),
    /unexpected games response/i,
  );
});
