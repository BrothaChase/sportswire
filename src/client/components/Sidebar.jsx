import { Link } from "react-router-dom";

function Icon({ type }) {
  const paths = {
    lobby: <><path d="M3 11.5 12 4l9 7.5V21H3z" /><path d="M9 21v-6h6v6" /></>,
    trivia: <><circle cx="12" cy="12" r="8" /><path d="M12 4v8l5 3" /></>,
    stats: <path d="M4 19V9m5 10V5m6 14v-7m5 7V3" />,
    leaderboard: <><path d="M8 3h8v4a4 4 0 0 1-8 0z" /><path d="M6 5H3v2a5 5 0 0 0 5 5m10-7h3v2a5 5 0 0 1-5 5M12 11v7m-4 3h8" /></>,
    profile: <><circle cx="12" cy="8" r="4" /><path d="M4 21c.7-5 3.3-7 8-7s7.3 2 8 7" /></>,
    performance: <path d="M4 19h16M6 16l3-4 3 2 5-7 2 2" />,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H3v-4h.2a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" /></>,
  };

  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">{paths[type]}</svg>;
}

export function Brand() {
  return (
    <Link className="brand" to="/" aria-label="SportsWire home">
      <div className="brand-mark">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M2.5 12h4l2.4-4.3 3.4 9 3.2-5.5h6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="brand-name">SportsWire<small>Sports IQ</small></div>
    </Link>
  );
}

export default function Sidebar({ activePage, onOpenSettings }) {
  return (
    <aside className="sidebar">
      <Brand />
      <div className="nav-label">Arena</div>
      <nav className="nav">
        <Link className={`nav-btn ${activePage === "lobby" ? "active" : ""}`} to="/"><Icon type="lobby" /><span>Home</span></Link>
        <Link className={`nav-btn ${activePage === "trivia" ? "active" : ""}`} to="/trivia"><Icon type="trivia" /><span>Live Trivia</span></Link>
        <button className="nav-btn" type="button"><Icon type="stats" /><span>Stat Lab</span></button>
        <button className="nav-btn" type="button"><Icon type="leaderboard" /><span>Leaderboard</span></button>
      </nav>
      <div className="nav-label" style={{ marginTop: 18 }}>You</div>
      <nav className="nav">
        <button className="nav-btn" type="button"><Icon type="profile" /><span>Profile</span></button>
        <button className="nav-btn" type="button"><Icon type="performance" /><span>Performance</span></button>
        <button className="nav-btn" type="button" onClick={onOpenSettings}><Icon type="settings" /><span>Settings</span></button>
      </nav>
      <div className="season-pass">
        <strong>Season 08</strong>
        <p>1,420 XP until the Playmaker division.</p>
        <div className="progress"><span /></div>
      </div>
    </aside>
  );
}

export function MobileNav({ activePage, onOpenSettings }) {
  return (
    <nav className="mobile-nav">
      <Link className={activePage === "lobby" ? "active" : ""} to="/">⌂<span>Home</span></Link>
      <Link className={activePage === "trivia" ? "active" : ""} to="/trivia">◉<span>Trivia</span></Link>
      <button type="button">▥<span>Stats</span></button>
      <button type="button">♛<span>Ranks</span></button>
      <button type="button" onClick={onOpenSettings}>⚙<span>Settings</span></button>
    </nav>
  );
}

export function Profile() {
  return <div className="profile"><div className="streak">🔥 8 day streak</div><div className="avatar">CB</div></div>;
} 
