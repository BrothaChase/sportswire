import assert from "node:assert/strict";
import test from "node:test";
import { isValidIsoDate } from "./nbaDate.js";

// Validates that the isValidIsoDate function correctly identifies valid and invalid ISO date strings
test("accepts real ISO calendar dates including leap day", () => {
  assert.equal(isValidIsoDate("2026-11-12"), true);
  assert.equal(isValidIsoDate("2024-02-29"), true);
});

test("rejects impossible calendar dates", () => {
  assert.equal(isValidIsoDate("2023-02-29"), false);
  assert.equal(isValidIsoDate("2026-02-30"), false);
  assert.equal(isValidIsoDate("2026-13-01"), false);
  assert.equal(isValidIsoDate("2026-01-00"), false);
});

test("rejects missing, duplicate, and incorrectly formatted date values", () => {
  assert.equal(isValidIsoDate(undefined), false);
  assert.equal(isValidIsoDate(["2026-11-12", "2026-11-13"]), false);
  assert.equal(isValidIsoDate("11/12/2026"), false);
  assert.equal(isValidIsoDate("2026-1-2"), false);
  assert.equal(isValidIsoDate("2026-11-12T00:00:00Z"), false);
});
