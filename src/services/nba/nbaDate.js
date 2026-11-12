const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

// Validates if a string is a valid ISO date (YYYY-MM-DD format)
export function isValidIsoDate(value) {
  if (typeof value !== "string") return false;

  const match = ISO_DATE_PATTERN.exec(value);
  if (!match) return false;

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const candidate = new Date(0);

  candidate.setUTCHours(0, 0, 0, 0);
  candidate.setUTCFullYear(year, month - 1, day);

  return (
    candidate.getUTCFullYear() === year &&
    candidate.getUTCMonth() === month - 1 &&
    candidate.getUTCDate() === day
  );
}
