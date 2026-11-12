// Converts BALLDONTLIE's numeric period into a compact basketball label.
export function formatNbaPeriod(period) {
  if (!Number.isInteger(period) || period < 1) return null;
  if (period <= 4) return `Q${period}`;

  const overtimeNumber = period - 4;
  return overtimeNumber === 1 ? "OT" : `${overtimeNumber}OT`;
}

// Pregame and unavailable states should not display provider score placeholders.
export function shouldShowNbaScore(status) {
  return status === "live" || status === "final";
}

// Winner styling is safe only when a completed game has both scores.
export function getNbaWinner({ status, awayScore, homeScore }) {
  if (status !== "final" || awayScore == null || homeScore == null) {
    return null;
  }
  if (awayScore > homeScore) return "away";
  if (homeScore > awayScore) return "home";
  return null;
}
