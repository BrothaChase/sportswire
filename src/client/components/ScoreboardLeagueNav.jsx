import { Link } from "react-router-dom";
import "../styles/scoreboardLeagueNav.css";

export default function ScoreboardLeagueNav({ activeLeague, nbaDate }) {
  return (
    <nav className="scoreboard-league-switcher" aria-label="Scoreboard league">
      <Link to="/stats/nfl" aria-current={activeLeague === "nfl" ? "page" : undefined}>
        NFL
      </Link>
      <Link
        to={nbaDate ? `/stats/nba?date=${nbaDate}` : "/stats/nba"}
        aria-current={activeLeague === "nba" ? "page" : undefined}
      >
        NBA
      </Link>
    </nav>
  );
}

