import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { openRooms } from "../data/sportsData.js";
import SettingsDialog from "../components/SettingsDialog.jsx";
import Sidebar, { MobileNav, Profile } from "../components/Sidebar.jsx";
import { useTheme } from "../theme.js";

function RoomPreview({ preview, onCopy, onAction }) {
  if (!preview) {
    return (
      <div className="preview-empty">
        <div className="preview-mark">?</div>
        <h3>No room selected</h3>
        <p>Create a new room or enter a code to preview the lobby here.</p>
      </div>
    );
  }

  return (
    <>
      <div className="preview-live"><i />{preview.isHost ? "New private room" : "Room available"}</div>
      <div className="preview-code-label">Room code</div>
      <button className="preview-code" type="button" onClick={onCopy} aria-label="Copy room code">{preview.code}<small>Tap to copy</small></button>
      <h3>{preview.name}</h3>
      <div className="preview-tags"><span>{preview.category}</span><span>{preview.detail}</span></div>
      <div className="host-row"><div className="mini-avatar">{preview.host.slice(0, 2).toUpperCase()}</div><div><small>Host</small><b>{preview.host}</b></div></div>
      <button className="preview-action" type="button" onClick={onAction}>{preview.action} <span>→</span></button>
    </>
  );
}


export default function TriviaPage() {
  const navigate = useNavigate();
  const [themeName, setThemeName] = useTheme();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState("Classic");
  const [roomName, setRoomName] = useState("");
  const [hostName, setHostName] = useState("");
  const [category, setCategory] = useState("NFL");
  const [questionCount, setQuestionCount] = useState(10);
  const [roomCode, setRoomCode] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [codeState, setCodeState] = useState("");
  const [codeHelp, setCodeHelp] = useState("Codes use six letters or numbers.");
  const [nameError, setNameError] = useState(false);
  const [preview, setPreview] = useState(null);
  const [toast, setToast] = useState("");
  const previewRef = useRef(null);
  const joinCardRef = useRef(null);
  const roomCodeRef = useRef(null);
  const displayNameRef = useRef(null);

  function notify(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2300);
  }

  async function createRoom(event) {
    event.preventDefault();
    if (!roomName.trim()) return;

    try {
      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: roomName.trim(), category, questionCount, format: selectedFormat, hostName: hostName.trim() }),
      });
      const result = await response.json();

      if (!response.ok) {
        notify(result.error || "Unable to create the room.");
        return;
      }

      const { room, player } = result;
      sessionStorage.setItem(`sportswire:room:${room.code}:playerId`, player.id);

      setPreview({
        code: room.code,
        name: room.name,
        category: room.category,
        detail: `${room.questionCount} questions · ${room.format}`,
        host: player.name,
        isHost: true,
        action: "Enter waiting room",
      });
      notify(`Room ${room.code} created for preview.`);
      window.setTimeout(() => previewRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 0);
    } catch {
      notify("Unable to reach the SportsWire server.");
    }
  }

  function updateRoomCode(value) {
    setRoomCode(value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6));
    setCodeState("");
    setCodeHelp("Codes use six letters or numbers.");
  }

  async function joinRoom(event) {
    event.preventDefault();
    const code = roomCode.trim();
    const playerName = displayName.trim();

    if (code.length !== 6) {
      setCodeState("error");
      setCodeHelp("Enter all six characters to find the room.");
      roomCodeRef.current?.focus();
      return;
    }

    if (!playerName) {
      setNameError(true);
      displayNameRef.current?.focus();
      notify("Enter a display name.");
      return;
    }

    try {
      const response = await fetch(`/api/rooms/${code}/players`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: playerName }),
      });
      const result = await response.json();

      if (!response.ok) {
        setCodeState("error");
        setCodeHelp(result.error || "Unable to find that room.");
        notify(`Room ${code} was not found.`);
        return;
      }

      const { room, player } = result;
      sessionStorage.setItem(`sportswire:room:${room.code}:playerId`, player.id);
      const host = room.players.find((player) => player.isHost);

      setCodeState("success");
      setCodeHelp("Room joined.");
      setPreview({
        code: room.code,
        name: room.name,
        category: room.category,
        detail: `${room.questionCount} questions · ${room.format}`,
        host: host ? host.name : "Unknown host",
        isHost: false,
        action: "Enter waiting room",
      });
      notify(`You joined room ${code}.`);
    } catch {
      notify("Unable to reach the SportsWire server.");
    }
  }

  function loadRoomCode(code) {
    updateRoomCode(code);
    joinCardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => roomCodeRef.current?.focus(), 0);
    notify(`${code} loaded. Add your display name to preview it.`);
  }

  async function copyRoomCode() {
    try {
      await navigator.clipboard.writeText(preview.code);
    } catch {
      // The preview remains usable when clipboard access is unavailable.
    }
    notify(`Room code ${preview.code} copied.`);
  }

  return (
    <>
      <div className="shell trivia-shell">
        <Sidebar activePage="trivia" onOpenSettings={() => setSettingsOpen(true)} />

        <main className="main trivia-main">
          <header className="topbar">
            <div className="page-crumb"><span>Arena</span><b>/</b><strong>Trivia rooms</strong></div>
            <Profile />
          </header>

          <section className="trivia-hero">
            <div className="trivia-hero-grid" />
            <div className="trivia-copy">
              <div className="eyebrow"><i /> SportsWire Trivia</div>
              <h1>Your arena.<br /><span>Your rules.</span></h1>
              <p>Build a room for your crew or enter a code to join the action. Every answer counts.</p>
            </div>
            <div className="trivia-stat-stack" aria-label="Trivia activity">
              <div><b>2.4K</b><span>Players online</span></div>
              <div><b>186</b><span>Rooms live</span></div>
              <div><b>73%</b><span>Avg. accuracy</span></div>
            </div>
          </section>

          <section className="room-actions-grid" aria-label="Room actions">
            <article className="room-action-card create-card">
              <div className="action-card-head"><div className="action-icon">＋</div><div><span>Host a game</span><h2>Create a room</h2></div></div>
              <p className="action-copy">Choose the sport, format, and pace. We’ll generate a room code for your players.</p>
              <form className="room-form" onSubmit={createRoom}>
                <label>Room name<input value={roomName} onChange={(event) => setRoomName(event.target.value)} name="roomName" maxLength="32" placeholder=" Enter Room Name" required /></label>
                <label> Host name<input value={hostName} onChange={(event) => setHostName(event.target.value)} name="hostName" maxLength="20" placeholder="Enter Your Name" required /></label>
                <div className="form-row">
                  <label>Category<select value={category} onChange={(event) => setCategory(event.target.value)} name="category">
                    {['NFL', 'NBA', 'NCAAF', 'MLB', 'Soccer', 'All Sports'].map((option) => <option key={option}>{option}</option>)}
                  </select></label>
                  <label>Questions<select value={questionCount} onChange={(event) => setQuestionCount(Number(event.target.value))} name="questions">
                    {[5, 10, 15, 20].map((count) => <option value={count} key={count}>{count} questions</option>)}
                  </select></label>
                </div>
                <div className="format-label">Game format</div>
                <div className="format-options" role="group" aria-label="Game format">
                  {[
                    ["Classic", "15 sec / question"],
                    ["Rapid Fire", "8 sec / question"],
                    ["No Clock", "Take your time"],
                  ].map(([format, detail]) => (
                    <button className={`format-option ${selectedFormat === format ? "selected" : ""}`} type="button" key={format} onClick={() => setSelectedFormat(format)}><b>{format}</b><small>{detail}</small></button>
                  ))}
                </div>
                <button className="room-primary" type="submit">Create room <span>→</span></button>
              </form>
            </article>

            <article className="room-action-card join-card" ref={joinCardRef}>
              <div className="action-card-head"><div className="action-icon">↗</div><div><span>Enter the arena</span><h2>Join a room</h2></div></div>
              <p className="action-copy">Ask the host for their six-character room code, then enter it below.</p>
              <form className="join-form" onSubmit={joinRoom}>
                <label htmlFor="roomCode">Room code</label>
                <input
                  ref={roomCodeRef}
                  className={codeState === "error" ? "input-error" : codeState === "success" ? "input-success" : ""}
                  id="roomCode"
                  name="roomCode"
                  value={roomCode}
                  onChange={(event) => updateRoomCode(event.target.value)}
                  maxLength="6"
                  autoComplete="off"
                  spellCheck="false"
                  placeholder="SW24IQ"
                  aria-describedby="codeHelp"
                  required
                />
                <div className="code-help" id="codeHelp">{codeHelp}</div>
                <label htmlFor="displayName">Display name</label>
                <input
                  ref={displayNameRef}
                  className={nameError ? "input-error" : ""}
                  id="displayName"
                  name="displayName"
                  value={displayName}
                  onChange={(event) => { setDisplayName(event.target.value); setNameError(false); }}
                  maxLength="20"
                  placeholder="Enter Name"
                  required
                />
                <button className="room-secondary" type="submit">Find room <span>→</span></button>
              </form>
              <div className="join-divider"><span>or</span></div>
              <button className="quick-match" type="button" onClick={() => { updateRoomCode("QKPLAY"); displayNameRef.current?.focus(); notify("Quick Match demo code loaded."); }}>
                <span className="pulse-dot" /><span><b>Quick match</b><small>Join a public game starting soon</small></span><strong>›</strong>
              </button>
            </article>
          </section>

          <div className="section-head"><div><h2>Rooms starting soon</h2><p>Preview public games and load a room code instantly.</p></div><span className="frontend-badge">Frontend preview</span></div>
          <section className="open-rooms">
            {openRooms.map((room) => (
              <article className="open-room" key={room.code}>
                <div className="room-sport">{room.sport}</div>
                <div><span>Starts in {room.starts}</span><h3>{room.name}</h3><p>{room.detail}</p></div>
                <button type="button" onClick={() => loadRoomCode(room.code)}>Preview</button>
              </article>
            ))}
          </section>
        </main>

        <aside className="rail trivia-rail">
          <div className="rail-head"><h2>Room preview</h2><span>{preview ? (preview.isHost ? "CREATED" : "FOUND") : "READY"}</span></div>
          <div className="room-preview" ref={previewRef}>
            <RoomPreview preview={preview} onCopy={copyRoomCode} onAction={() => navigate(`/rooms/${preview.code}`)} />
          </div>
          <div className="how-it-works">
            <h3>How it works</h3>
            <ol>
              <li><b>Set the matchup</b><span>Pick a sport and question format.</span></li>
              <li><b>Invite your crew</b><span>Share the six-character room code.</span></li>
              <li><b>Climb the board</b><span>Score for speed and accuracy.</span></li>
            </ol>
          </div>
          <div className="demo-note"><strong>Development preview</strong><p>Room creation and joining use the Express API. Live multiplayer gameplay will be added later.</p></div>
        </aside>
      </div>

      <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} themeName={themeName} onThemeChange={setThemeName} />
      <MobileNav activePage="trivia" onOpenSettings={() => setSettingsOpen(true)} />
      <div className={`toast ${toast ? "show" : ""}`} role="status">{toast || "Room preview ready."}</div>
    </>
  );
}
