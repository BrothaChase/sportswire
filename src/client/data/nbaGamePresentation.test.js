import assert from "node:assert/strict";
import test from "node:test";
import {
  formatNbaPeriod,
  getNbaWinner,
  shouldShowNbaScore,
} from "./nbaGamePresentation.js";

test("formats regulation and overtime periods", () => {
  assert.equal(formatNbaPeriod(1), "Q1");
  assert.equal(formatNbaPeriod(4), "Q4");
  assert.equal(formatNbaPeriod(5), "OT");
  assert.equal(formatNbaPeriod(6), "2OT");
  assert.equal(formatNbaPeriod(7), "3OT");
  assert.equal(formatNbaPeriod(0), null);
  assert.equal(formatNbaPeriod(null), null);
});

test("shows scores only for live and final games", () => {
  assert.equal(shouldShowNbaScore("live"), true);
  assert.equal(shouldShowNbaScore("final"), true);
  assert.equal(shouldShowNbaScore("upcoming"), false);
  assert.equal(shouldShowNbaScore("postponed"), false);
  assert.equal(shouldShowNbaScore("unavailable"), false);
});

test("identifies a winner only for complete final scores", () => {
  assert.equal(
    getNbaWinner({ status: "final", awayScore: 105, homeScore: 99 }),
    "away",
  );
  assert.equal(
    getNbaWinner({ status: "final", awayScore: 101, homeScore: 110 }),
    "home",
  );
  assert.equal(
    getNbaWinner({ status: "live", awayScore: 105, homeScore: 99 }),
    null,
  );
  assert.equal(
    getNbaWinner({ status: "final", awayScore: null, homeScore: 99 }),
    null,
  );
  assert.equal(
    getNbaWinner({ status: "final", awayScore: 100, homeScore: 100 }),
    null,
  );
});
