import { useRef, useState } from "react";
import { marketData, scheduleData } from "../data/sportsData.js";
import SettingsDialog from "../components/SettingsDialog.jsx";
import Sidebar, { MobileNav, Profile } from "../components/Sidebar.jsx";
import { useTheme } from "../theme.js";

const leagues = ["For You", "NFL", "NBA", "NCAAF", "MLB", "Soccer"];

function MatchupCard({ game, onAnalyze }) {
  const edge = Number(game.edge);
  const signalClass = edge >= 8.5 ? "signal-positive" : edge < 8 ? "signal-negative" : "signal-neutral";

  return (
    <article className="matchup">
      <div className="match-time"><span>{game.day}</span><b>{game.meta}</b></div>
      <div className="match-team">
        <div><span>{game.a[0]}</span>{game.a[1]}</div>
        <div><span>{game.b[0]}</span>{game.b[1]}</div>
      </div>
      <div className="match-bottom">
        <div className={`edge ${signalClass}`}><small>Analysis</small><b>{game.edge}</b></div>
        <button className="analyze-btn" type="button" onClick={onAnalyze}>View stats</button>
      </div>
    </article>
  );
}

function MarketCard({ market, selectedChoice, onSelect }) {
  return (
    <article className="market-card">
      <div className="market-top"><span>{market.meta}</span><b>+{market.xp} XP</b></div>
      <div className="question">{market.question}</div>
      <div className="pick-row">
        {market.choices.map((choice) => (
          <button
            className={`pick ${selectedChoice === choice ? "selected" : ""}`}
            type="button"
            key={choice}
            onClick={() => onSelect(market.question, choice)}
          >
            {choice}
          </button>
        ))}
      </div>
      <div className={`confidence ${market.confidence >= 50 ? "signal-positive" : "signal-negative"}`}>
        <span>{market.source} {market.confidence}%</span>
        <div className="confidence-bar"><i style={{ width: `${market.confidence}%` }} /></div>
      </div>
    </article>
  );
}

function PickSlip({ picks, onRemove }) {
  const entries = Object.entries(picks);

  if (!entries.length) {
    return <div className="empty-slip"><div className="empty-icon">＋</div>Select an answer from any card to build your challenge.</div>;
  }

  return entries.map(([question, choice], index) => (
    <div className="slip-item" key={question}>
      <div className="slip-kicker"><span>Pick {index + 1}</span><button type="button" onClick={() => onRemove(question)} aria-label="Remove pick">×</button></div>
      <h3>{question}</h3>
      <div className="slip-choice">{choice}</div>
    </div>
  ));
}

export default function LobbyPage() {
  const [league, setLeague] = useState("For You");
  const [picks, setPicks] = useState({});
  const [toast, setToast] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [themeName, setThemeName] = useTheme();
  const matchupsRef = useRef(null);
  const marketRef = useRef(null);
  const games = scheduleData[league] || scheduleData["For You"];
  const pickCount = Object.keys(picks).length;

  function notify(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  }

  function selectLeague(nextLeague) {
    setLeague(nextLeague);
    matchupsRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  }

  function selectPick(question, choice) {
    setPicks((current) => ({ ...current, [question]: choice }));
  }

  function removePick(question) {
    setPicks((current) => {
      const next = { ...current };
      delete next[question];
      return next;
    });
  }

  return (
    <>
      <div className="shell">
        <Sidebar activePage="lobby" onOpenSettings={() => setSettingsOpen(true)} />

        <main className="main">
          <header className="topbar">
            <div className="league-tabs">
              {leagues.map((name) => (
                <button className={`league-tab ${league === name ? "active" : ""}`} type="button" key={name} onClick={() => selectLeague(name)}>{name}</button>
              ))}
            </div>
            <Profile />
          </header>

          <section className="hero">
            <div className="hero-grid" />
            <div className="live-pill"><i /> LIVE · Q3 04:18</div>
            <h1>Read the game.<br /><span>Call the next play.</span></h1>
            <p className="hero-copy">Three questions. Ninety seconds. Your sports IQ is on the clock.</p>
            <button className="primary-btn" type="button" onClick={() => marketRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })}>Play live challenge</button>
            <div className="hero-score">
              <div className="team"><div className="team-logo">🦅</div>Philadelphia</div>
              <div className="scorebox"><b>17 — 20</b><small>3rd &amp; 7</small></div>
              <div className="team"><div className="team-logo">⭐</div>Dallas</div>
            </div>
          </section>

          <div className="section-head">
            <div>
              <h2>{league === "For You" ? "Tonight's slate" : `${league} slate`}</h2>
              <p>{league === "For You" ? "Upcoming games across your favorite leagues." : `Today and upcoming ${league} games this week.`}</p>
            </div>
            <div className="slate-actions">
              <button type="button" onClick={() => matchupsRef.current?.scrollBy({ left: -230, behavior: "smooth" })} aria-label="Previous games">‹</button>
              <button type="button" onClick={() => matchupsRef.current?.scrollBy({ left: 230, behavior: "smooth" })} aria-label="Next games">›</button>
            </div>
          </div>
          <section className="matchups" ref={matchupsRef} aria-live="polite">
            {games.map((game) => <MatchupCard game={game} key={`${game.meta}-${game.a[0]}-${game.b[0]}`} onAnalyze={() => notify("Matchup analysis added to your feed.")} />)}
          </section>

          <div className="section-head">
            <div><h2>Trending picks</h2><p>Build a card with the calls you believe in.</p></div>
            <button type="button" onClick={() => setPicks({})}>Clear card</button>
          </div>
          <section className="market-grid" ref={marketRef}>
            {marketData.map((market) => <MarketCard market={market} selectedChoice={picks[market.question]} onSelect={selectPick} key={market.question} />)}
          </section>
        </main>

        <aside className="rail">
          <div className="rail-head"><h2>My picks</h2><span>{pickCount} PICK{pickCount === 1 ? "" : "S"}</span></div>
          <div className="slip"><PickSlip picks={picks} onRemove={removePick} /></div>
          <div className="lock-box">
            <div className="lock-row"><span>Potential XP</span><b>{pickCount * 120} XP</b></div>
            <div className="lock-row" style={{ marginTop: 7 }}><span>Accuracy boost</span><b>{(1 + Math.max(0, pickCount - 1) * 0.25).toFixed(2)}×</b></div>
            <button className="lock-btn" type="button" disabled={!pickCount} onClick={() => notify("Picks locked. Results will update live.")}>Lock in picks</button>
          </div>
          <div className="insight">
            <h3>Your form</h3>
            <div className="metric signal-positive"><span className="metric-label">NFL</span><div className="metric-track"><i style={{ width: "84%" }} /></div><b>84</b></div>
            <div className="metric signal-positive"><span className="metric-label">NBA</span><div className="metric-track"><i style={{ width: "71%" }} /></div><b>71</b></div>
            <div className="metric signal-negative"><span className="metric-label">NCAA</span><div className="metric-track"><i style={{ width: "63%" }} /></div><b>63</b></div>
          </div>
        </aside>
      </div>

      <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} themeName={themeName} onThemeChange={setThemeName} />
      <MobileNav activePage="lobby" onOpenSettings={() => setSettingsOpen(true)} />
      <div className={`toast ${toast ? "show" : ""}`} role="status">{toast || "Picks locked. Results will update live."}</div>
    </>
  );
}
