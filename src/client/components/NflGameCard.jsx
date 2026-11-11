const labels = {
  upcoming: "Upcoming", live: "Live", final: "Final", postponed: "Postponed",
  canceled: "Canceled", delayed: "Delayed", suspended: "Suspended",
  abandoned: "Abandoned", unavailable: "Status unavailable",
};

function TeamLine({ team, score, showScore, winner, location }) {
  return (
    <div className={`nfl-team ${winner ? "nfl-team-winner" : ""}`}>
      <span className="nfl-team-mark" style={{ borderColor: team.color }} aria-hidden="true">{team.abbreviation}</span>
      <div><span className="nfl-team-city">{team.city}</span><strong>{team.name}</strong></div>
      <span className="nfl-team-location">{location}</span>
      <strong className="nfl-score">{showScore ? (score ?? "—") : "—"}</strong>
    </div>
  );
}

export default function NflGameCard({ game }) {
  const kickoff = new Date(game.scheduledAt);
  const kickoffKnown = Number.isFinite(kickoff.getTime());
  const showScore = game.status === "live" || game.status === "final";
  const completed = game.status === "final" && game.awayScore != null && game.homeScore != null;

  return (
    <article className="nfl-game" aria-label={`${game.awayTeam.fullName} at ${game.homeTeam.fullName}`}>
      <div className="nfl-game-heading">
        <span className={`nfl-status nfl-status-${game.status}`}>{labels[game.status] ?? "Status unavailable"}</span>
        {kickoffKnown && <time dateTime={game.scheduledAt}>{kickoff.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}</time>}
      </div>
      <TeamLine team={game.awayTeam} score={game.awayScore} showScore={showScore} winner={completed && game.awayScore > game.homeScore} location="Away" />
      <TeamLine team={game.homeTeam} score={game.homeScore} showScore={showScore} winner={completed && game.homeScore > game.awayScore} location="Home" />
      <div className="nfl-game-footer">
        <span>{game.status === "live"
          ? (game.statusLabel || "Clock / quarter unavailable")
          : kickoffKnown ? kickoff.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", timeZoneName: "short" }) : "Kickoff unavailable"}</span>
        <span>{game.venue || "Venue unavailable"}</span>
      </div>
    </article>
  );
}
