import {
  formatNbaPeriod,
  getNbaWinner,
  shouldShowNbaScore,
} from "../data/nbaGamePresentation.js";

const labels = {
  upcoming: "Upcoming",
  live: "Live",
  final: "Final",
  postponed: "Postponed",
  canceled: "Canceled",
  delayed: "Delayed",
  suspended: "Suspended",
  abandoned: "Abandoned",
  unavailable: "Status unavailable",
};

function TeamLine({ team, score, showScore, winner, location }) {
  return (
    <div className={`nba-team ${winner ? "nba-team-winner" : ""}`}>
      <span
        className="nba-team-mark"
        style={{ borderColor: team.color }}
        aria-hidden="true"
      >
        {team.abbreviation}
      </span>
      <div>
        <span className="nba-team-city">{team.city}</span>
        <strong>{team.name}</strong>
      </div>
      <span className="nba-team-location">{location}</span>
      <strong className="nba-score">{showScore ? (score ?? "—") : "—"}</strong>
    </div>
  );
}

export default function NbaGameCard({ game }) {
  const tipoff = new Date(game.scheduledAt);
  const tipoffKnown = Number.isFinite(tipoff.getTime());
  const showScore = shouldShowNbaScore(game.status);
  const winner = getNbaWinner(game);

  // Live games prefer normalized period and clock data over provider display text.
  const liveDetail = [formatNbaPeriod(game.period), game.clock]
    .filter(Boolean)
    .join(" · ");
  const gameDetail =
    game.status === "live"
      ? liveDetail || game.statusLabel || "Period / clock unavailable"
      : game.status === "final"
        ? game.statusLabel || "Final"
        : tipoffKnown
          ? tipoff.toLocaleTimeString(undefined, {
              hour: "numeric",
              minute: "2-digit",
              timeZoneName: "short",
            })
          : "Tipoff unavailable";

  return (
    <article
      className="nba-game"
      aria-label={`${game.awayTeam.fullName} at ${game.homeTeam.fullName}`}
    >
      <div className="nba-game-heading">
        <span className={`nba-status nba-status-${game.status}`}>
          {labels[game.status] ?? "Status unavailable"}
        </span>
        {tipoffKnown && (
          <time dateTime={game.scheduledAt}>
            {tipoff.toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </time>
        )}
      </div>

      {/* Each team receives only its own score and final winner state. */}
      <TeamLine
        team={game.awayTeam}
        score={game.awayScore}
        showScore={showScore}
        winner={winner === "away"}
        location="Away"
      />
      <TeamLine
        team={game.homeTeam}
        score={game.homeScore}
        showScore={showScore}
        winner={winner === "home"}
        location="Home"
      />

      <div className="nba-game-footer">
        <span>{gameDetail}</span>
      </div>
    </article>
  );
}
