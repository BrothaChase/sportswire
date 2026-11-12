import assert from "node:assert/strict";
import test from "node:test";
import {
  createNbaScheduleDate,
  formatLocalIsoDate,
  getDaysInMonth,
  getNbaDateContext,
  readNbaScheduleQuery,
} from "./nbaSchedule.js";

const today = new Date(2026, 10, 12, 14, 30);

test("missing date uses the device-local date and marks the default", () => {
  assert.deepEqual(readNbaScheduleQuery(new URLSearchParams(), today), {
    date: "2026-11-12",
    year: 2026,
    month: 11,
    day: 12,
    error: null,
    usedDefault: true,
  });
  assert.equal(formatLocalIsoDate(today), "2026-11-12");
});

test("valid dates from 2013 through the current year are accepted", () => {
  assert.equal(
    readNbaScheduleQuery(new URLSearchParams("date=2013-01-01"), today).error,
    null,
  );
  assert.equal(
    readNbaScheduleQuery(new URLSearchParams("date=2026-12-31"), today).error,
    null,
  );
});

test("invalid, duplicate, and out-of-range dates report an error", () => {
  for (const query of [
    "date=2026-02-29",
    "date=2026-13-01",
    "date=2026-1-01",
    "date=2012-12-31",
    "date=2027-01-01",
    "date=hello",
    "date=2026-01-01&date=2026-01-02",
  ]) {
    assert.match(
      readNbaScheduleQuery(new URLSearchParams(query), today).error,
      /2013 through 2026/,
    );
  }
});

test("month lengths and clamping handle leap years", () => {
  assert.equal(getDaysInMonth(2024, 2), 29);
  assert.equal(getDaysInMonth(2026, 2), 28);
  assert.equal(createNbaScheduleDate(2026, 4, 31), "2026-04-30");
  assert.equal(createNbaScheduleDate(2024, 2, 31), "2024-02-29");
});

test("date context distinguishes past, today, and future", () => {
  assert.equal(getNbaDateContext("2026-11-11", today), "past");
  assert.equal(getNbaDateContext("2026-11-12", today), "today");
  assert.equal(getNbaDateContext("2026-11-13", today), "future");
});

