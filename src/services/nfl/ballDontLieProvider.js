const DEFAULT_BASE_URL = "https://api.balldontlie.io/nfl/v1";

const teamColors = {
  ARI: "#97233f",
  ATL: "#a71930",
  BAL: "#241773",
  BUF: "#00338d",
  CAR: "#0085ca",
  CHI: "#0b162a",
  CIN: "#fb4f14",
  CLE: "#311d00",
  DAL: "#003594",
  DEN: "#fb4f14",
  DET: "#0076b6",
  GB: "#203731",
  HOU: "#03202f",
  IND: "#002c5f",
  JAX: "#006778",
  KC: "#e31837",
  LV: "#a5acaf",
  LAC: "#0080c6",
  LAR: "#003594",
  MIA: "#008e97",
  MIN: "#4f2683",
  NE: "#002244",
  NO: "#d3bc8d",
  NYG: "#0b2265",
  NYJ: "#125740",
  PHI: "#004c54",
  PIT: "#ffb612",
  SEA: "#002244",
  SF: "#aa0000",
  TB: "#d50a0a",
  TEN: "#0c2340",
  WAS: "#5a1414",
  WSH: "#5a1414",
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
    city: team.location,
    name: team.name,
    fullName: team.full_name,
    color: teamColors[team.abbreviation] ?? "#64748b",
  };
}

export function normalizeBallDontLieGame(game) {
  return {
    id: `bdl-${game.id}`,
    providerId: game.id,
    season: game.season,
    week: game.week,
    scheduledAt: game.date,
    status: normalizeStatus(game.status_state),
    statusLabel: game.status ?? null,
    awayTeam: normalizeTeam(game.visitor_team),
    homeTeam: normalizeTeam(game.home_team),
    awayScore: game.visitor_team_score ?? null,
    homeScore: game.home_team_score ?? null,
    venue: game.venue ?? null,
    providerUpdatedAt: game.updated_at ?? null,
  };
}
// fetches and returns a list of normalized games for specific season and date range, or throws an error if the request fails. The returned games are sorted by scheduled date/time.
export function createBallDontLieProvider({
  apiKey = process.env.BALLDONTLIE_API_KEY,
  baseUrl = process.env.BALLDONTLIE_BASE_URL ?? DEFAULT_BASE_URL,
  fetchImpl = globalThis.fetch,
  timeoutMs = 8_000,
} = {}) {
  return {
    async getGames({ season, week }) {
      if (!apiKey) {
        throw new Error("BALLDONTLIE_API_KEY is not configured");
      }

      const url = new URL(`${baseUrl.replace(/\/$/, "")}/games`);
      url.searchParams.append("seasons[]", String(season));
      url.searchParams.append("weeks[]", String(week));
      url.searchParams.append("season_types[]", "2");
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

        return payload.data.map(normalizeBallDontLieGame);
      } finally {
        clearTimeout(timeout);
      }
    },
  };
}
