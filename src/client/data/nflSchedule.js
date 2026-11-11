// Calendar suggestion only; the provider is the authority on actual games.
// Regular-season kickoff is typically the Thursday after Labor Day.
export function suggestNflWeek(date = new Date()) {
  const year = date.getFullYear();
  const season = date.getMonth() < 2 ? year - 1 : year;
  const septemberFirst = new Date(season, 8, 1);
  const laborDay = 1 + ((8 - septemberFirst.getDay()) % 7);
  // Advance the selector on Tuesday, after the usual Monday night game.
  const firstTuesday = Date.UTC(season, 8, laborDay + 8);
  const today = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const week = Math.max(
    1,
    Math.min(18, 2 + Math.floor((today - firstTuesday) / 604_800_000)),
  );
  return { season, week };
}

export function isGameToday(scheduledAt, today = new Date()) {
  const kickoff = new Date(scheduledAt);
  return (
    Number.isFinite(kickoff.getTime()) &&
    kickoff.toDateString() === today.toDateString()
  );
}

export function readNflScheduleQuery(
  searchParams,
  defaults,
  currentYear = new Date().getFullYear(),
) {
  // Missing parameters use defaults. Present-but-invalid values stay invalid.
  const readValue = (key, fallback) =>
    searchParams.has(key) ? Number(searchParams.get(key)) : fallback;
  const season = readValue("season", defaults.season);
  const week = readValue("week", defaults.week);
  const errors = [];

  if (
    searchParams.getAll("season").length > 1 ||
    !Number.isInteger(season) ||
    season < 2002 ||
    season > currentYear
  ) {
    errors.push(`Season must be a whole year from 2002 to ${currentYear}.`);
  }
  if (
    searchParams.getAll("week").length > 1 ||
    !Number.isInteger(week) ||
    week < 1 ||
    week > 18
  ) {
    errors.push("Week must be a number from 1 to 18.");
  }

  return { season, week, error: errors.join(" ") || null };
}
