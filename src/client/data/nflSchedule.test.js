import assert from "node:assert/strict";
import test from "node:test";
import { suggestNflWeek, isGameToday, readNflScheduleQuery } from "./nflSchedule.js";

const defaults = { season: 2026, week: 10 };

test("missing query parameters use defaults, valid parameters preserve the selection", () => {
  assert.deepEqual(readNflScheduleQuery(new URLSearchParams(), defaults, 2026), { ...defaults, error: null });
  assert.deepEqual(readNflScheduleQuery(new URLSearchParams("season=2025&week=18"), defaults, 2026), { season: 2025, week: 18, error: null });
  assert.equal(readNflScheduleQuery(new URLSearchParams("week=1"), defaults, 2026).season, 2026);
});

test("explicitly invalid weeks report an error instead of silently using defaults", () => {
  for (const query of ["week=99", "week=0", "week=2.5", "week=hello", "week=", "week=1&week=2"]) {
    assert.match(readNflScheduleQuery(new URLSearchParams(query), defaults, 2026).error, /Week/);
  }
});

test("invalid seasons and simultaneous errors are reported", () => {
  for (const query of ["season=2001", "season=2027", "season=2025.5", "season=hello", "season=", "season=2025&season=2026"]) {
    assert.match(readNflScheduleQuery(new URLSearchParams(query), defaults, 2026).error, /Season/);
  }
  const result = readNflScheduleQuery(new URLSearchParams("season=no&week=99"), defaults, 2026);
  assert.match(result.error, /Season.*Week/);
});

test("calendar suggestion keeps Monday in the old week and advances Tuesday", () => {
  assert.deepEqual(suggestNflWeek(new Date(2026, 8, 10)), { season: 2026, week: 1 });
  assert.deepEqual(suggestNflWeek(new Date(2026, 8, 14)), { season: 2026, week: 1 });
  assert.deepEqual(suggestNflWeek(new Date(2026, 8, 15)), { season: 2026, week: 2 });
  assert.deepEqual(suggestNflWeek(new Date(2026, 10, 11)), { season: 2026, week: 10 });
});

test("calendar suggestion handles season boundaries and stays within regular-season weeks", () => {
  assert.deepEqual(suggestNflWeek(new Date(2027, 0, 5)), { season: 2026, week: 18 });
  assert.deepEqual(suggestNflWeek(new Date(2027, 3, 1)), { season: 2027, week: 1 });
});

test("today filter compares device-local calendar days and rejects missing dates", () => {
  const today = new Date(2026, 10, 11, 12);
  assert.equal(isGameToday(new Date(2026, 10, 11, 23).toISOString(), today), true);
  assert.equal(isGameToday(new Date(2026, 10, 12, 0).toISOString(), today), false);
  assert.equal(isGameToday(undefined, today), false);
});
