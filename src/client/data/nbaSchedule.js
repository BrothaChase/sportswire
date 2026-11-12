export const NBA_FIRST_YEAR = 2013;

export function formatLocalIsoDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

export function createNbaScheduleDate(year, month, day) {
  // Clamp the day so changing from a longer month never creates an invalid URL.
  const safeDay = Math.min(day, getDaysInMonth(year, month));
  return `${year}-${String(month).padStart(2, "0")}-${String(safeDay).padStart(2, "0")}`;
}

export function readNbaScheduleQuery(
  searchParams,
  today = new Date(),
  currentYear = today.getFullYear(),
) {
  const todayDate = formatLocalIsoDate(today);

  if (!searchParams.has("date")) {
    return {
      date: todayDate,
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate(),
      error: null,
      usedDefault: true,
    };
  }

  const value = searchParams.get("date");
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? "");
  const year = Number(match?.[1]);
  const month = Number(match?.[2]);
  const day = Number(match?.[3]);
  const realDate =
    Boolean(match) &&
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    day <= getDaysInMonth(year, month);
  const inSupportedRange = year >= NBA_FIRST_YEAR && year <= currentYear;

  if (
    searchParams.getAll("date").length !== 1 ||
    !realDate ||
    !inSupportedRange
  ) {
    return {
      date: todayDate,
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate(),
      error: `Choose a real date from ${NBA_FIRST_YEAR} through ${currentYear}.`,
      usedDefault: false,
    };
  }

  return { date: value, year, month, day, error: null, usedDefault: false };
}

export function getNbaDateContext(date, today = new Date()) {
  const todayDate = formatLocalIsoDate(today);
  if (date < todayDate) return "past";
  if (date > todayDate) return "future";
  return "today";
}

