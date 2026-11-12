import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import NbaGameCard from "../components/NbaGameCard.jsx";
import ScoreboardLeagueNav from "../components/ScoreboardLeagueNav.jsx";
import SettingsDialog from "../components/SettingsDialog.jsx";
import Sidebar, { MobileNav, Profile } from "../components/Sidebar.jsx";
import {
  createNbaScheduleDate,
  formatLocalIsoDate,
  getDaysInMonth,
  getNbaDateContext,
  NBA_FIRST_YEAR,
  readNbaScheduleQuery,
} from "../data/nbaSchedule.js";
import { useNbaGames } from "../hooks/useNbaGames.js";
import { useTheme } from "../theme.js";
import "../styles/nbaScoreboard.css";

const filters = ["All games", "Live", "Upcoming", "Final"];
const months = Array.from({ length: 12 }, (_, index) => ({
  value: index + 1,
  label: new Intl.DateTimeFormat(undefined, { month: "long" }).format(
    new Date(2026, index, 1),
  ),
}));

export default function NbaScoreboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [today] = useState(() => new Date());
  const currentYear = today.getFullYear();
  const schedule = readNbaScheduleQuery(searchParams, today, currentYear);
  const { date, year, month, day, error: queryError, usedDefault } = schedule;
  const [filter, setFilter] = useState("All games");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [themeName, setThemeName] = useTheme();
  const { games, status, stale, warning, lastUpdated, retry } = useNbaGames({
    date,
    enabled: !queryError,
  });
  const busy = status === "loading" || status === "refreshing";

  // Put the default date in the URL so the selected slate is linkable.
  useEffect(() => {
    if (usedDefault) setSearchParams({ date }, { replace: true });
  }, [date, setSearchParams, usedDefault]);

  const visibleGames = games
    .filter(
      (game) =>
        filter === "All games" || game.status === filter.toLowerCase(),
    )
    .sort((a, b) => Date.parse(a.scheduledAt) - Date.parse(b.scheduledAt));
  const selectedDate = new Date(`${date}T12:00:00`);
  const formattedDate = selectedDate.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const dateContext = getNbaDateContext(date, today);
  const slateHeading =
    dateContext === "today"
      ? "Tonight’s NBA slate"
      : dateContext === "past"
        ? `Past games on ${formattedDate}`
        : `Upcoming games on ${formattedDate}`;
  const todayDate = formatLocalIsoDate(today);

  function chooseDate(nextYear, nextMonth, nextDay) {
    const nextDate = createNbaScheduleDate(nextYear, nextMonth, nextDay);
    setSearchParams({ date: nextDate });
    setFilter("All games");
  }

  function chooseToday() {
    setSearchParams({ date: todayDate });
    setFilter("All games");
  }

  return (
    <>
      <div className="shell nba-shell">
        <Sidebar
          activePage="stats"
          onOpenSettings={() => setSettingsOpen(true)}
        />
        <main className="main nba-main">
          <header className="topbar">
            <div className="page-crumb">
              <span>Stat Lab</span><b>/</b><strong>NBA</strong>
            </div>
            <Profile />
          </header>

          {queryError ? (
            <section
              className="nba-invalid-schedule"
              role="alert"
              aria-labelledby="nba-invalid-title"
            >
              <div className="nba-invalid-message">
                <h1 id="nba-invalid-title">Date Not Found</h1>
                <div>
                  <p>{queryError}</p>
                  <Link to={`/stats/nba?date=${todayDate}`}>
                    Back to today’s slate <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </section>
          ) : (
            <>
              <ScoreboardLeagueNav activeLeague="nba" nbaDate={date} />

              <div className="nba-intro">
                <div>
                  <span className="nba-eyebrow">{slateHeading}</span>
                  <h1>NBA Scoreboard<span>.</span></h1>
                  <p>The matchups. The scores. Your night at a glance.</p>
                </div>
                <span className="nba-season-tag">NBA</span>
              </div>

              <section className="nba-toolbar" aria-label="Schedule controls">
                <div className="nba-selectors">
                  <label>
                    Year
                    <select
                      value={year}
                      onChange={(event) =>
                        chooseDate(Number(event.target.value), month, day)
                      }
                    >
                      {Array.from(
                        { length: currentYear - NBA_FIRST_YEAR + 1 },
                        (_, index) => currentYear - index,
                      ).map((value) => <option key={value}>{value}</option>)}
                    </select>
                  </label>
                  <label>
                    Month
                    <select
                      value={month}
                      onChange={(event) =>
                        chooseDate(year, Number(event.target.value), day)
                      }
                    >
                      {months.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Day
                    <select
                      value={day}
                      onChange={(event) =>
                        chooseDate(year, month, Number(event.target.value))
                      }
                    >
                      {Array.from(
                        { length: getDaysInMonth(year, month) },
                        (_, index) => index + 1,
                      ).map((value) => <option key={value}>{value}</option>)}
                    </select>
                  </label>
                  <button
                    type="button"
                    className="nba-today"
                    disabled={date === todayDate}
                    onClick={chooseToday}
                  >
                    Today
                  </button>
                </div>
                <button
                  type="button"
                  className="nba-refresh"
                  disabled={busy}
                  onClick={retry}
                >
                  {busy ? "Refreshing…" : "↻ Refresh"}
                </button>
              </section>

              <div className="nba-schedule-heading">
                <h2>{formattedDate}</h2>
                <span>{games.length} games{stale ? " · Delayed" : ""}</span>
              </div>
              <div className="nba-filter-bar" role="group" aria-label="Filter games">
                {filters.map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={filter === value}
                    onClick={() => setFilter(value)}
                  >
                    {value}
                    {value === "Live" && (
                      <span className="nba-live-count">
                        {games.filter((game) => game.status === "live").length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {stale && (
                <p className="nba-notice" role="status">
                  {warning || "Game data may be delayed. Showing the last successful update."}
                </p>
              )}
              {status === "loading" ? (
                <div className="nba-state" role="status">
                  <span className="nba-loading-dot" /> Slate is loading…
                </div>
              ) : status === "error" ? (
                <div className="nba-state" role="alert">
                  <h3>Unable to load the NBA slate</h3>
                  <p>NBA game data is temporarily unavailable. Please try again.</p>
                  <button className="nba-refresh" type="button" onClick={retry}>
                    Try again
                  </button>
                </div>
              ) : status === "empty" ? (
                <div className="nba-state">
                  <h3>No games are scheduled on {formattedDate}.</h3>
                  <p>Choose another date to view a different slate.</p>
                </div>
              ) : !visibleGames.length ? (
                <div className="nba-state">
                  <h3>No {filter.toLowerCase()} games on {formattedDate}.</h3>
                  <p>Choose All games or select a different date.</p>
                </div>
              ) : (
                <div className="nba-game-grid" aria-busy={busy}>
                  {visibleGames.map((game) => (
                    <NbaGameCard key={game.id} game={game} />
                  ))}
                </div>
              )}

              <footer className="nba-data-footer">
                <span>Data: BALLDONTLIE · Updates every 30 seconds while this tab is visible.</span>
                <span>
                  {lastUpdated
                    ? `Fetched ${new Date(lastUpdated).toLocaleTimeString()}`
                    : "Awaiting first update"}
                </span>
                <span>Tipoff times use your device’s timezone.</span>
              </footer>
            </>
          )}
        </main>
      </div>
      <SettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        themeName={themeName}
        onThemeChange={setThemeName}
      />
      <MobileNav
        activePage="stats"
        onOpenSettings={() => setSettingsOpen(true)}
      />
    </>
  );
}

