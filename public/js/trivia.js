const triviaThemes = {
  green: [
    "#b7ff3c",
    "#83d900",
    "183,255,60",
    "#cbff72",
    "#31450f",
    "#172d37",
    "#1d3924",
    "#3f6500",
  ],
  gold: [
    "#d0a42c",
    "#a87b12",
    "208,164,44",
    "#e1bb51",
    "#4a3b16",
    "#1a1916",
    "#27220f",
    "#72550e",
  ],
  orange: [
    "#ff8a24",
    "#d76400",
    "255,138,36",
    "#ffad66",
    "#5c2d08",
    "#211712",
    "#3c200b",
    "#803d07",
  ],
  red: [
    "#ff4d5a",
    "#d92635",
    "255,77,90",
    "#ff7a84",
    "#5b1820",
    "#231416",
    "#3d1218",
    "#7d1720",
  ],
  purple: [
    "#a970ff",
    "#7b42d4",
    "169,112,255",
    "#c59dff",
    "#37205d",
    "#1d1727",
    "#2b1746",
    "#57308d",
  ],
  blue: [
    "#49b7ff",
    "#138bd6",
    "73,183,255",
    "#82ceff",
    "#163f5d",
    "#172536",
    "#12334d",
    "#15587e",
  ],
  analytics: [
    "#65d9e8",
    "#2aaec0",
    "101,217,232",
    "#8be5ef",
    "#2a2a28",
    "#1b1b1a",
    "#20201f",
    "#2b8998",
  ],
};

function applySavedTheme() {
  const savedTheme = localStorage.getItem("sportswire-theme");
  const themeName = triviaThemes[savedTheme] ? savedTheme : "gold";
  const values = triviaThemes[themeName];
  document.documentElement.dataset.theme = themeName;
  const properties = [
    "--acid",
    "--acid-2",
    "--accent-rgb",
    "--accent-hover",
    "--avatar-start",
    "--hero-mid",
    "--hero-end",
    "--metric-start",
  ];
  properties.forEach((property, index) =>
    document.documentElement.style.setProperty(property, values[index]),
  );
  document.documentElement.style.setProperty("--blue", values[0]);
  document.documentElement.style.setProperty("--gold", values[0]);
}

const toast = document.getElementById("toast");
const preview = document.getElementById("roomPreview");
const roomStatus = document.getElementById("roomStatus");
let selectedFormat = "Classic";

function notify(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2300);
}

function renderPreview({ code, name, category, detail, host, action }) {
  roomStatus.textContent = action === "Host room" ? "CREATED" : "FOUND";
  preview.innerHTML = `
    <div class="preview-live"><i></i>${action === "Host room" ? "New private room" : "Room available"}</div>
    <div class="preview-code-label">Room code</div>
    <button class="preview-code" id="copyRoomCode" type="button" aria-label="Copy room code">${code}<small>Tap to copy</small></button>
    <h3>${name}</h3>
    <div class="preview-tags"><span>${category}</span><span>${detail}</span></div>
    <div class="host-row"><div class="mini-avatar">${host.slice(0, 2).toUpperCase()}</div><div><small>Host</small><b>${host}</b></div></div>
    <button class="preview-action" id="previewAction" type="button">${action} <span>→</span></button>`;
  document
    .getElementById("copyRoomCode")
    .addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(code);
      } catch (_) {
        /* Preview still works without clipboard permission.  */
      }
      notify(`Room code ${code} copied.`);
    });
  document
    .getElementById("previewAction")
    .addEventListener("click", () =>
      notify("Frontend preview complete — backend connection comes next."),
    );
}

document.querySelectorAll(".format-option").forEach((button) => {
  button.addEventListener("click", () => {
    document
      .querySelectorAll(".format-option")
      .forEach((option) => option.classList.remove("selected"));
    button.classList.add("selected");
    selectedFormat = button.dataset.format;
  });
});

document
  .getElementById("createRoomForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    // Get the values from the form inputs
    const name = document.getElementById("roomName").value.trim();
    const category = document.getElementById("roomCategory").value;
    const questions = document.getElementById("questionCount").value;

    if (!name) return;

    const response = await fetch("/api/rooms", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name,
        category,
        questionCount: Number.parseInt(questions, 10), // Convert the question count to a number "10 questions" -> 10
        format: selectedFormat,
      }),
    });

    const room = await response.json();

    if (!response.ok) {
      notify(room.error || "Unable to create the room.");
      return;
    }

    renderPreview({
      code: room.code,
      name: room.name,
      category: room.category,
      detail: `${room.questionCount} questions · ${room.format}`,
      host: "Chase",
      action: "Host room",
    });
    notify(`Room ${room.code} created for preview.`);
    preview.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

const roomCode = document.getElementById("roomCode");
const displayNameInput = document.getElementById("displayName");

roomCode.addEventListener("input", () => {
  roomCode.value = roomCode.value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 6);
  roomCode.classList.remove("input-error", "input-success"); // remove any previous input style
  document.getElementById("codeHelp").textContent =
    "Codes use six letters or numbers.";
});

displayNameInput.addEventListener("input", () => {
  displayNameInput.classList.remove("input-error");
});

document
  .getElementById("joinRoomForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const code = roomCode.value.trim();
    const displayName = displayNameInput.value.trim();

    if (code.length !== 6) {
      // show room code error if the code is not six characters
      roomCode.classList.add("input-error");
      document.getElementById("codeHelp").textContent =
        "Enter all six characters to find the room.";
      roomCode.focus();
      return;
    }

    if (!displayName) {
      displayNameInput.classList.add("input-error");
      displayNameInput.focus();
      notify("Enter a display name.");
      return;
    }
    // Fetch the room details from the server
    const response = await fetch(`/api/rooms/${code}/players`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        displayName,
      }),
    });
    const room = await response.json();

    // error handling
    if (!response.ok) {
      roomCode.classList.add("input-error");
      document.getElementById("codeHelp").textContent =
        room.error || "Unable to find that room.";
      notify(`Room ${code} was not found.`);
      return;
    }

    if (response.ok) {
      roomCode.classList.add("input-success");
      document.getElementById("codeHelp").textContent = "Room joined.";
      notify(`You joined room ${code}.`);
    }

    // test fetching room details from the server
    console.log(response.status, room);

    renderPreview({
      code,
      name: "SportsWire Trivia Room",
      category: "Mixed sports",
      detail: "10 questions · Classic",
      host: displayName || "Player",
      action: "Enter preview",
    });
  });

document.querySelectorAll(".open-room button").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".open-room");

    roomCode.value = card.dataset.code;
    document
      .getElementById("joinCard")
      .scrollIntoView({ behavior: "smooth", block: "center" });
    roomCode.focus();
    notify(`${card.dataset.code} loaded. Add your display name to preview it.`);
  });
});

document.getElementById("quickMatch").addEventListener("click", () => {
  roomCode.value = "QKPLAY";
  document.getElementById("displayName").focus();
  notify("Quick Match demo code loaded.");
});

applySavedTheme();
