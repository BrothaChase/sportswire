const DEFAULT_BASE_URL = "https://api.balldontlie.io/v1";

const teamColors = {
  ATL: "#e03a3e",
  BOS: "#007a33",
  BKN: "#000000",
  CHA: "#1d1160",
  CHI: "#ce1141",
  CLE: "#860038",
  DAL: "#00538c",
  DEN: "#0e2240",
  DET: "#c8102e",
  GSW: "#1d428a",
  HOU: "#ce1141",
  IND: "#002d62",
  LAC: "#c8102e",
  LAL: "#552583",
  MEM: "#5d76a9",
  MIA: "#98002e",
  MIL: "#00471b",
  MIN: "#0c2340",
  NOP: "#0c2340",
  NYK: "#006bb6",
  OKC: "#007ac1",
  ORL: "#0077c0",
  PHI: "#006bb6",
  PHX: "#1d1160",
  POR: "#e03a3e",
  SAC: "#5a2d81",
  SAS: "#c4ced4",
  TOR: "#ce1141",
  UTA: "#002b5c",
  WAS: "#002b5c",
};

function normalizeStatus(statusState) {
  if (statusState === "scheduled") return "upcoming";
  if (statusState === "in_progress") return "live";
  if (statusState === "final") return "final";
  if (
    ["postponed", "canceled", "delayed", "suspended", "abandoned"].includes(
      statusState,
    )
  ) {
    return statusState;
  }
  return "unavailable";
}

function normalizeTeam(team) {
  return {
    id: team.abbreviation,
    providerId: team.id,
    abbreviation: team.abbreviation,
    city: team.city,
    name: team.name,
    fullName: team.full_name,
    color: teamColors[team.abbreviation] ?? "#64748b",
  };
}

export function normalizeBallDontLieNbaGame(game) {
  const clock = typeof game.time === "string" ? game.time.trim() : "";

  return {
    id: `bdl-nba-${game.id}`,
    providerId: game.id,
    scheduledAt: game.datetime ?? null,
    status: normalizeStatus(game.status_state),
    statusLabel: game.status ?? null,
    clock: clock || null,
    period: Number.isInteger(game.period) ? game.period : null,
    awayTeam: normalizeTeam(game.visitor_team),
    homeTeam: normalizeTeam(game.home_team),
    awayScore: game.visitor_team_score ?? null,
    homeScore: game.home_team_score ?? null,
  };
}

export function createBallDontLieNbaProvider({
  apiKey = process.env.BALLDONTLIE_API_KEY,
  baseUrl = process.env.BALLDONTLIE_NBA_BASE_URL ?? DEFAULT_BASE_URL,
  fetchImpl = globalThis.fetch,
  timeoutMs = 8_000,
} = {}) {
  return {
    async getGames({ date }) {
      if (!apiKey) {
        throw new Error("BALLDONTLIE_API_KEY is not configured");
      }

      const url = new URL(`${baseUrl.replace(/\/$/, "")}/games`);
      url.searchParams.append("dates[]", date);
      url.searchParams.set("per_page", "100");

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await fetchImpl(url, {
          headers: { Authorization: apiKey },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `BALLDONTLIE request failed with status ${response.status}`,
          );
        }

        const payload = await response.json();
        if (!Array.isArray(payload.data)) {
          throw new Error("BALLDONTLIE returned an unexpected games response");
        }

        return payload.data.map(normalizeBallDontLieNbaGame);
      } finally {
        clearTimeout(timeout);
      }
    },
  };
}
