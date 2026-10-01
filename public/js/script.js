const themes = {
  green: {
    accent: "#b7ff3c",
    accent2: "#83d900",
    rgb: "183,255,60",
    hover: "#cbff72",
    avatar: "#31450f",
    heroMid: "#172d37",
    heroEnd: "#1d3924",
    metric: "#3f6500",
  },
  gold: {
    accent: "#d0a42c",
    accent2: "#a87b12",
    rgb: "208,164,44",
    hover: "#e1bb51",
    avatar: "#4a3b16",
    heroMid: "#1a1916",
    heroEnd: "#27220f",
    metric: "#72550e",
  },
  orange: {
    accent: "#ff8a24",
    accent2: "#d76400",
    rgb: "255,138,36",
    hover: "#ffad66",
    avatar: "#5c2d08",
    heroMid: "#211712",
    heroEnd: "#3c200b",
    metric: "#803d07",
  },
  red: {
    accent: "#ff4d5a",
    accent2: "#d92635",
    rgb: "255,77,90",
    hover: "#ff7a84",
    avatar: "#5b1820",
    heroMid: "#231416",
    heroEnd: "#3d1218",
    metric: "#7d1720",
  },
  purple: {
    accent: "#a970ff",
    accent2: "#7b42d4",
    rgb: "169,112,255",
    hover: "#c59dff",
    avatar: "#37205d",
    heroMid: "#1d1727",
    heroEnd: "#2b1746",
    metric: "#57308d",
  },
  blue: {
    accent: "#49b7ff",
    accent2: "#138bd6",
    rgb: "73,183,255",
    hover: "#82ceff",
    avatar: "#163f5d",
    heroMid: "#172536",
    heroEnd: "#12334d",
    metric: "#15587e",
  },
  analytics: {
    accent: "#65d9e8",
    accent2: "#2aaec0",
    rgb: "101,217,232",
    hover: "#8be5ef",
    avatar: "#2a2a28",
    heroMid: "#1b1b1a",
    heroEnd: "#20201f",
    metric: "#2b8998",
  },
};
function applyTheme(name, save = true) {
  const theme = themes[name] || themes.gold;
  const root = document.documentElement.style;
  document.documentElement.dataset.theme = themes[name] ? name : "gold";
  root.setProperty("--acid", theme.accent);
  root.setProperty("--acid-2", theme.accent2);
  root.setProperty("--blue", theme.accent);
  root.setProperty("--gold", theme.accent);
  root.setProperty("--accent-rgb", theme.rgb);
  root.setProperty("--accent-hover", theme.hover);
  root.setProperty("--avatar-start", theme.avatar);
  root.setProperty("--hero-mid", theme.heroMid);
  root.setProperty("--hero-end", theme.heroEnd);
  root.setProperty("--metric-start", theme.metric);
  document
    .querySelectorAll(".theme-choice")
    .forEach((button) =>
      button.classList.toggle("selected", button.dataset.theme === name),
    );
  if (save) localStorage.setItem("sportswire-theme", name);
}

const scheduleData = {
  "For You": [
    {
      day: "Tonight · 7:30 PM",
      meta: "NBA · TNT",
      a: ["BOS", "Celtics"],
      b: ["NYK", "Knicks"],
      edge: "8.4",
    },
    {
      day: "Tonight · 8:15 PM",
      meta: "NFL · Prime",
      a: ["BUF", "Bills"],
      b: ["BAL", "Ravens"],
      edge: "7.8",
    },
    {
      day: "Sat · 3:30 PM",
      meta: "NCAAF · ESPN",
      a: ["ALA", "Alabama"],
      b: ["UGA", "Georgia"],
      edge: "9.1",
    },
    {
      day: "Sun · 4:25 PM",
      meta: "NFL · FOX",
      a: ["SF", "49ers"],
      b: ["GB", "Packers"],
      edge: "8.7",
    },
  ],
  NFL: [
    {
      day: "Thu · 8:15 PM",
      meta: "NFL · Prime",
      a: ["BUF", "Bills"],
      b: ["BAL", "Ravens"],
      edge: "7.8",
    },
    {
      day: "Sun · 1:00 PM",
      meta: "NFL · CBS",
      a: ["KC", "Chiefs"],
      b: ["CIN", "Bengals"],
      edge: "9.3",
    },
    {
      day: "Sun · 4:25 PM",
      meta: "NFL · FOX",
      a: ["SF", "49ers"],
      b: ["GB", "Packers"],
      edge: "8.7",
    },
    {
      day: "Mon · 8:15 PM",
      meta: "NFL · ESPN",
      a: ["PHI", "Eagles"],
      b: ["DAL", "Cowboys"],
      edge: "9.0",
    },
  ],
  NBA: [
    {
      day: "Tonight · 7:30 PM",
      meta: "NBA · TNT",
      a: ["BOS", "Celtics"],
      b: ["NYK", "Knicks"],
      edge: "8.4",
    },
    {
      day: "Tonight · 10:00 PM",
      meta: "NBA · ESPN",
      a: ["LAL", "Lakers"],
      b: ["GSW", "Warriors"],
      edge: "9.2",
    },
    {
      day: "Fri · 8:00 PM",
      meta: "NBA · LP",
      a: ["DEN", "Nuggets"],
      b: ["OKC", "Thunder"],
      edge: "8.8",
    },
    {
      day: "Sun · 6:00 PM",
      meta: "NBA · ESPN",
      a: ["MIL", "Bucks"],
      b: ["MIA", "Heat"],
      edge: "7.6",
    },
  ],
  NCAAF: [
    {
      day: "Sat · 12:00 PM",
      meta: "NCAAF · ABC",
      a: ["TEX", "Texas"],
      b: ["OU", "Oklahoma"],
      edge: "8.9",
    },
    {
      day: "Sat · 3:30 PM",
      meta: "NCAAF · ESPN",
      a: ["ALA", "Alabama"],
      b: ["UGA", "Georgia"],
      edge: "9.1",
    },
    {
      day: "Sat · 7:30 PM",
      meta: "NCAAF · NBC",
      a: ["OSU", "Ohio State"],
      b: ["MICH", "Michigan"],
      edge: "9.5",
    },
    {
      day: "Sat · 8:00 PM",
      meta: "NCAAF · FOX",
      a: ["ORE", "Oregon"],
      b: ["PSU", "Penn State"],
      edge: "8.3",
    },
  ],
  MLB: [
    {
      day: "Tonight · 7:05 PM",
      meta: "MLB · YES",
      a: ["BOS", "Red Sox"],
      b: ["NYY", "Yankees"],
      edge: "8.6",
    },
    {
      day: "Tonight · 8:10 PM",
      meta: "MLB · TV+",
      a: ["CHC", "Cubs"],
      b: ["STL", "Cardinals"],
      edge: "7.7",
    },
    {
      day: "Sat · 4:10 PM",
      meta: "MLB · FOX",
      a: ["LAD", "Dodgers"],
      b: ["SD", "Padres"],
      edge: "9.0",
    },
    {
      day: "Sun · 1:35 PM",
      meta: "MLB · ESPN+",
      a: ["ATL", "Braves"],
      b: ["PHI", "Phillies"],
      edge: "8.2",
    },
  ],
  Soccer: [
    {
      day: "Sat · 7:30 AM",
      meta: "EPL · Peacock",
      a: ["MCI", "Man City"],
      b: ["ARS", "Arsenal"],
      edge: "9.4",
    },
    {
      day: "Sat · 12:30 PM",
      meta: "EPL · NBC",
      a: ["LIV", "Liverpool"],
      b: ["CHE", "Chelsea"],
      edge: "8.8",
    },
    {
      day: "Sun · 11:30 AM",
      meta: "EPL · Peacock",
      a: ["TOT", "Tottenham"],
      b: ["NEW", "Newcastle"],
      edge: "7.9",
    },
    {
      day: "Wed · 3:00 PM",
      meta: "UCL · Para+",
      a: ["RMA", "Real Madrid"],
      b: ["BAY", "Bayern"],
      edge: "9.6",
    },
  ],
};
const matchups = document.getElementById("matchups");

const picks = new Map();
const slip = document.getElementById("slip");
const count = document.getElementById("pickCount");
const xp = document.getElementById("xpValue");
const boost = document.getElementById("boostValue");
const lock = document.getElementById("lockBtn");
const toast = document.getElementById("toast");
const settingsDialog = document.getElementById("settingsDialog");

function notify(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
    toast.textContent = "Picks locked. Results will update live.";
  }, 2200);
}

function renderSchedule(league) {
  const games = scheduleData[league] || scheduleData["For You"];
  document.getElementById("slateTitle").textContent =
    league === "For You" ? "Tonight's slate" : `${league} slate`;
  document.getElementById("slateSubtitle").textContent =
    league === "For You"
      ? "Upcoming games across your favorite leagues."
      : `Today and upcoming ${league} games this week.`;
  matchups.innerHTML = games
    .map(
      (game) => {
        const edge = Number(game.edge);
        const signalClass =
          edge >= 8.5
            ? "signal-positive"
            : edge < 8
              ? "signal-negative"
              : "signal-neutral";
        return `<article class="matchup"><div class="match-time"><span>${game.day}</span><b>${game.meta}</b></div><div class="match-team"><div><span>${game.a[0]}</span>${game.a[1]}</div><div><span>${game.b[0]}</span>${game.b[1]}</div></div><div class="match-bottom"><div class="edge ${signalClass}"><small>Analysis</small><b>${game.edge}</b></div><button class="analyze-btn">View stats</button></div></article>`;
      },
    )
    .join("");
  matchups.scrollTo({ left: 0, behavior: "smooth" });
  matchups
    .querySelectorAll(".analyze-btn")
    .forEach((btn) =>
      btn.addEventListener("click", () =>
        notify("Matchup analysis added to your feed."),
      ),
    );
}

function renderSlip() {
  count.textContent = `${picks.size} PICK${picks.size === 1 ? "" : "S"}`;
  xp.textContent = `${picks.size * 120} XP`;
  boost.textContent = `${(1 + Math.max(0, picks.size - 1) * 0.25).toFixed(2)}×`;
  lock.disabled = picks.size === 0;
  if (!picks.size) {
    slip.innerHTML =
      '<div class="empty-slip"><div class="empty-icon">＋</div>Select an answer from any card to build your challenge.</div>';
    return;
  }
  slip.innerHTML = [...picks.entries()]
    .map(
      ([question, choice], i) =>
        `<div class="slip-item"><div class="slip-kicker"><span>Pick ${i + 1}</span><button data-remove="${question}" aria-label="Remove pick">×</button></div><h3>${question}</h3><div class="slip-choice">${choice}</div></div>`,
    )
    .join("");
  slip.querySelectorAll("[data-remove]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const q = btn.dataset.remove;
      picks.delete(q);
      document.querySelectorAll(".market-card").forEach((card) => {
        if (card.dataset.question === q)
          card
            .querySelectorAll(".pick")
            .forEach((p) => p.classList.remove("selected"));
      });
      renderSlip();
    }),
  );
}

document.querySelectorAll(".market-card").forEach((card) => {
  card.querySelectorAll(".pick").forEach((button) =>
    button.addEventListener("click", () => {
      card
        .querySelectorAll(".pick")
        .forEach((p) => p.classList.remove("selected"));
      button.classList.add("selected");
      picks.set(card.dataset.question, button.dataset.choice);
      renderSlip();
    }),
  );
});
document.getElementById("clearPicks").addEventListener("click", () => {
  picks.clear();
  document
    .querySelectorAll(".pick")
    .forEach((p) => p.classList.remove("selected"));
  renderSlip();
});
lock.addEventListener("click", () =>
  notify("Picks locked. Results will update live."),
);
document.getElementById("playLive").addEventListener("click", () => {
  document
    .getElementById("marketGrid")
    .scrollIntoView({ behavior: "smooth", block: "center" });
});
document.querySelectorAll(".league-tab").forEach((tab) =>
  tab.addEventListener("click", () => {
    document
      .querySelectorAll(".league-tab")
      .forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    renderSchedule(tab.textContent.trim());
  }),
);
document.querySelectorAll(".nav-btn").forEach((btn) =>
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".nav-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  }),
);
document
  .getElementById("slatePrev")
  .addEventListener("click", () =>
    matchups.scrollBy({ left: -230, behavior: "smooth" }),
  );
document
  .getElementById("slateNext")
  .addEventListener("click", () =>
    matchups.scrollBy({ left: 230, behavior: "smooth" }),
  );
document
  .getElementById("settingsBtn")
  .addEventListener("click", () => settingsDialog.showModal());
document
  .getElementById("mobileSettingsBtn")
  .addEventListener("click", () => settingsDialog.showModal());
document
  .getElementById("settingsClose")
  .addEventListener("click", () => settingsDialog.close());
settingsDialog.addEventListener("click", (event) => {
  if (event.target === settingsDialog) settingsDialog.close();
});
document
  .querySelectorAll(".theme-choice")
  .forEach((button) =>
    button.addEventListener("click", () => applyTheme(button.dataset.theme)),
  );
applyTheme(
  localStorage.getItem("sportswire-theme") ||
    localStorage.getItem("handshake-theme") ||
    "gold",
  false,
);
renderSchedule("For You");
