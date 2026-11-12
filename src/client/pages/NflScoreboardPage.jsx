import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SettingsDialog from "../components/SettingsDialog.jsx";
import Sidebar, { MobileNav, Profile } from "../components/Sidebar.jsx";
import NflGameCard from "../components/NflGameCard.jsx";
import ScoreboardLeagueNav from "../components/ScoreboardLeagueNav.jsx";
import { isGameToday, readNflScheduleQuery, suggestNflWeek } from "../data/nflSchedule.js";
import { useNflGames } from "../hooks/useNflGames.js";
import { useTheme } from "../theme.js";
import "../styles/nflScoreboard.css";

const filters = ["All games", "Today", "Live", "Upcoming", "Final"];

export default function NflScoreboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [defaults] = useState(suggestNflWeek);
  const currentYear = new Date().getFullYear();
  const { season, week, error: queryError } = readNflScheduleQuery(searchParams, defaults, currentYear);
  const [filter, setFilter] = useState("All games");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [themeName, setThemeName] = useTheme();
  const { games, status, stale, warning, error, lastUpdated, retry } = useNflGames({ season, week, enabled: !queryError });
  const busy = status === "loading" || status === "refreshing";
  const visibleGames = games.filter((game) => filter === "All games" || (filter === "Today" ? isGameToday(game.scheduledAt) : game.status === filter.toLowerCase()))
    .sort((a, b) => Date.parse(a.scheduledAt) - Date.parse(b.scheduledAt));

  function chooseWeek(nextSeason, nextWeek) {
    setSearchParams({ season: String(nextSeason), week: String(nextWeek) });
  }

  return (
    <>
      <div className="shell nfl-shell">
        <Sidebar activePage="stats" onOpenSettings={() => setSettingsOpen(true)} />
        <main className="main nfl-main">
          <header className="topbar"><div className="page-crumb"><span>Stat Lab</span><b>/</b><strong>NFL</strong></div><Profile /></header>
          {queryError ? (
            <section className="nfl-invalid-schedule" role="alert" aria-labelledby="nfl-invalid-title">
              <div className="nfl-invalid-message">
                <h1 id="nfl-invalid-title">Week Not Found</h1>
                <div><p>{queryError}</p><Link to="/stats/nfl">Back to NFL scoreboard <span aria-hidden="true">→</span></Link></div>
              </div>
            </section>
          ) : (
            <>
              <ScoreboardLeagueNav activeLeague="nfl" />
              <div className="nfl-intro">
                <div><span className="nfl-eyebrow">THE WEEK IN FOOTBALL</span><h1>NFL Scoreboard<span>.</span></h1><p>The matchups. The scores. Your week at a glance.</p></div>
                <span className="nfl-season-tag">REGULAR SEASON</span>
              </div>

              <section className="nfl-toolbar" aria-label="Schedule controls">
                <div className="nfl-selectors">
                  <label>Season<select value={season} onChange={(event) => chooseWeek(Number(event.target.value), week)}>{Array.from({ length: currentYear - 2001 }, (_, index) => currentYear - index).map((year) => <option key={year} value={year}>{year}</option>)}</select></label>
                  <label>Week<select value={week} onChange={(event) => chooseWeek(season, Number(event.target.value))}>{Array.from({ length: 18 }, (_, index) => index + 1).map((value) => <option key={value} value={value}>Week {value}</option>)}</select></label>
                  <div className="nfl-week-arrows"><button type="button" aria-label="Previous week" disabled={week === 1} onClick={() => chooseWeek(season, week - 1)}>←</button><button type="button" aria-label="Next week" disabled={week === 18} onClick={() => chooseWeek(season, week + 1)}>→</button></div>
                </div>
                <button type="button" className="nfl-refresh" disabled={busy} onClick={retry}>{busy ? "Refreshing…" : "↻ Refresh"}</button>
              </section>

              <div className="nfl-schedule-heading"><h2>Week {week} <span>/ {season}</span></h2><span>{games.length} games{stale ? " · Delayed" : ""}</span></div>
              <div className="nfl-filter-bar" role="group" aria-label="Filter games">{filters.map((value) => <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)}>{value}{value === "Live" && <span className="nfl-live-count">{games.filter((game) => game.status === "live").length}</span>}</button>)}</div>

              {stale && <p className="nfl-notice" role="status">{warning || "Game data may be delayed. Showing the last successful update."}</p>}
              {status === "loading" ? (
                <div className="nfl-state" role="status"><span className="nfl-loading-dot" /> Loading NFL games…</div>
              ) : status === "error" ? (
                <div className="nfl-state" role="alert"><h3>Unable to load NFL games</h3><p>{error}</p><button className="nfl-refresh" type="button" onClick={retry}>Try again</button></div>
              ) : status === "empty" ? (
                <div className="nfl-state"><h3>No games are scheduled for this week.</h3><p>Try another regular-season week.</p></div>
              ) : !visibleGames.length ? (
                <div className="nfl-state"><h3>No {filter === "Today" ? "games today" : `${filter.toLowerCase()} games`} in this selected week.</h3><p>Choose All games or select a different week.</p></div>
              ) : (
                <div className="nfl-game-grid" aria-busy={busy}>{visibleGames.map((game) => <NflGameCard key={game.id} game={game} />)}</div>
              )}

              <footer className="nfl-data-footer"><span>Data: BALLDONTLIE · Updates every 60 seconds while this tab is visible.</span><span>{lastUpdated ? `Fetched ${new Date(lastUpdated).toLocaleTimeString()}` : "Awaiting first update"}</span><span>Kickoff times use your device’s timezone. The initial week is a calendar suggestion; select another week if needed.</span></footer>
            </>
          )}
        </main>
      </div>
      <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} themeName={themeName} onThemeChange={setThemeName} />
      <MobileNav activePage="stats" onOpenSettings={() => setSettingsOpen(true)} />
    </>
  );
}
