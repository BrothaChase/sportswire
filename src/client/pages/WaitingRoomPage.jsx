import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SettingsDialog from "../components/SettingsDialog.jsx";
import Sidebar, { MobileNav, Profile } from "../components/Sidebar.jsx";
import { useTheme } from "../theme.js";

export default function WaitingRoomPage() {
  const { code } = useParams();
  const roomCode = code?.toUpperCase() ?? "";
  const [room, setRoom] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [themeName, setThemeName] = useTheme();
  const currentPlayerId = sessionStorage.getItem(`sportswire:room:${roomCode}:playerId`);
  const currentPlayer = room?.players.find((player) => player.id === currentPlayerId);

  useEffect(() => {
    let active = true;

    async function loadRoom() {
      try {
        const response = await fetch(`/api/rooms/${encodeURIComponent(roomCode)}`);
        const data = await response.json();

        if (!active) return;
        if (!response.ok) {
          setRoom(null);
          setError(data.error || "Room unavailable.");
          return;
        }

        setRoom(data);
        setError("");
      } catch {
        if (active) setError("Unable to reach the SportsWire server.");
      }
    }

    loadRoom();
    const refresh = window.setInterval(loadRoom, 3000);
    return () => {
      active = false;
      window.clearInterval(refresh);
    };
  }, [roomCode]);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <>
      <div className="shell waiting-shell">
        <Sidebar activePage="trivia" onOpenSettings={() => setSettingsOpen(true)} />

        <main className="main waiting-main">
          <header className="topbar">
            <div className="page-crumb"><span>Arena</span><b>/</b><Link to="/trivia">Trivia rooms</Link><b>/</b><strong>Waiting room</strong></div>
            <Profile />
          </header>

          {error ? (
            <section className="waiting-state" role="alert">
              <span className="waiting-eyebrow">Room unavailable</span>
              <h1>{error}</h1>
              <p>Rooms are stored in server memory for now. If the server restarted, create a new room.</p>
              <Link className="waiting-button waiting-button-primary" to="/trivia">Back to trivia</Link>
            </section>
          ) : !room ? (
            <section className="waiting-state" role="status">Loading room {roomCode}…</section>
          ) : (
            <>
              <div className="waiting-intro">
                <div>
                  <span className="waiting-eyebrow">SportsWire trivia <span className="waiting-dot" /> Waiting for players</span>
                  <h1>{room.name}</h1>
                  <p>Share the code with your crew. Everyone in the room appears below.</p>
                </div>
                <Link className="waiting-back" to="/trivia">← Back to trivia</Link>
              </div>

              <div className="waiting-grid">
                <section className="waiting-card waiting-players">
                  <div className="waiting-card-heading">
                    <div><span className="waiting-eyebrow">Lobby</span><h2>Players</h2></div>
                    <span className="waiting-count">{room.players.length} joined</span>
                  </div>
                  <div className="waiting-player-list">
                    {room.players.map((player) => (
                      <div className="waiting-player" key={player.id}>
                        <div className="waiting-player-avatar">{player.name.slice(0, 2).toUpperCase()}</div>
                        <div className="waiting-player-name"><strong>{player.name}</strong><span>{player.isHost ? "Host" : "Player"}{player.id === currentPlayerId ? " · You" : ""}</span></div>
                        <span className="waiting-ready"><i />{player.isReady ? "Ready" : "Not ready"}</span>
                      </div>
                    ))}
                  </div>
                  <p className="waiting-card-note">The list refreshes as players join.</p>
                </section>

                <div className="waiting-side">
                  <section className="waiting-card waiting-invite">
                    <span className="waiting-eyebrow">Invite players</span>
                    <h2>Room code</h2>
                    <div className="waiting-code">{room.code}</div>
                    <button className="waiting-button waiting-button-primary" type="button" onClick={copyCode}>{copied ? "Copied" : "Copy code"}</button>
                    <p>Send this code to friends so they can join from the Trivia page.</p>
                  </section>

                  <section className="waiting-card waiting-settings">
                    <span className="waiting-eyebrow">Match setup</span>
                    <h2>Game settings</h2>
                    <dl>
                      <div><dt>Category</dt><dd>{room.category}</dd></div>
                      <div><dt>Questions</dt><dd>{room.questionCount}</dd></div>
                      <div><dt>Format</dt><dd>{room.format}</dd></div>
                    </dl>
                  </section>
                </div>
              </div>

              <section className="waiting-footer">
                <div><strong>{currentPlayer?.isHost ? "You're the host" : currentPlayer ? "You're in the room" : "Viewing the room"}</strong><p>Game controls are the next step. For now, invite players and watch the roster update.</p></div>
                <button className="waiting-button waiting-button-muted" type="button" disabled>Start game · Coming soon</button>
              </section>
            </>
          )}
        </main>
      </div>

      <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} themeName={themeName} onThemeChange={setThemeName} />
      <MobileNav activePage="trivia" onOpenSettings={() => setSettingsOpen(true)} />
    </>
  );
}
