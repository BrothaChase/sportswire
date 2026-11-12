import {
  createRoom,
  getRoom,
  joinRoom,
  leaveRoom,
} from "./rooms/roomManager.js";
import express from "express";
import path from "node:path";
import { loadEnvFile } from "node:process";
import { fileURLToPath } from "node:url";
import { createBallDontLieNbaProvider } from "./services/nba/ballDontLieProvider.js";
import { isValidIsoDate } from "./services/nba/nbaDate.js";
import { createNbaGamesService } from "./services/nba/nbaGamesService.js";
import { createBallDontLieProvider } from "./services/nfl/ballDontLieProvider.js";
import { createNflGamesService } from "./services/nfl/nflGamesService.js";

try {
  loadEnvFile();
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
}

const app = express();
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const distDirectory = path.resolve(currentDirectory, "../dist");
const nflGamesService = createNflGamesService({
  provider: createBallDontLieProvider(),
});

const nbaGamesService = createNbaGamesService({
  provider: createBallDontLieNbaProvider(),
});

const allowedCategories = [
  "NBA",
  "NFL",
  "MLB",
  "NCAAF",
  "Soccer",
  "All Sports",
];

const allowedQuestionCount = [5, 10, 15, 20];

const allowedFormats = ["Classic", "Rapid Fire", "No Clock"];

app.use(express.json()); // Parse incoming JSON requests
app.use(express.static(distDirectory)); // Serve the compiled React application

app.get("/api/nfl/games", async (req, res) => {
  const season = Number(req.query.season);
  const week = Number(req.query.week);

  if (!Number.isInteger(season) || season < 2002 || season > 2100) {
    return res.status(400).json({ error: "A valid NFL season is required" });
  }

  if (!Number.isInteger(week) || week < 1 || week > 18) {
    return res
      .status(400)
      .json({ error: "A regular-season NFL week from 1 to 18 is required" });
  }

  try {
    const result = await nflGamesService.getGames({ season, week });
    res.json(result);
  } catch (error) {
    console.error("Unable to load NFL games", error.message);
    res.status(502).json({
      error: "NFL game data is temporarily unavailable",
    });
  }
});

// NBA games route with date validation
app.get("/api/nba/games", async (req, res) => {
  const date = req.query.date;

  if (!isValidIsoDate(date)) {
    return res.status(400).json({
      error: "A valid NBA date in YYYY-MM-DD format is required",
    });
  }

  try {
    const result = await nbaGamesService.getGames({ date });
    res.json(result);
  } catch (error) {
    console.error("Unable to load NBA games", error.message);
    res.status(502).json({
      error: "NBA game data is temporarily unavailable",
    });
  }
});

// create room route
app.post("/api/rooms", (req, res) => {
  const { name, category, questionCount, format, hostName } = req.body ?? {};
  const parsedQuestionCount = Number(questionCount);

  if (!allowedCategories.includes(category)) {
    return res.status(400).json({
      error: "Invalid Category",
    });
  }

  if (!allowedQuestionCount.includes(parsedQuestionCount)) {
    return res.status(400).json({
      error: "Invalid Question Count",
    });
  }

  if (!allowedFormats.includes(format)) {
    return res.status(400).json({
      error: "Invalid Format",
    });
  }

  const roomName = typeof name === "string" ? name.trim() : "";
  const normalizedHostName =
    typeof hostName === "string" ? hostName.trim() : "";

  if (!roomName) {
    return res.status(400).json({
      error: "Room name is required",
    });
  }

  if (roomName.length > 32) {
    return res.status(400).json({
      error: "Room name must be 32 characters or fewer",
    });
  }

  if (!normalizedHostName) {
    return res.status(400).json({
      error: "Host name is required",
    });
  }

  if (normalizedHostName.length > 20) {
    return res.status(400).json({
      error: "Host name must be 20 characters or fewer",
    });
  }

  const result = createRoom({
    name: roomName,
    category,
    questionCount: parsedQuestionCount,
    format,
    hostName: normalizedHostName,
  });

  res.status(201).json(result); // Send the created room as the response
});

// get room by code route
app.get("/api/rooms/:code", (req, res) => {
  // :code is a route parameter representing the room code

  const code = req.params.code.toUpperCase();
  const room = getRoom(code); // Retrieve the room with the given code

  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }

  res.json(room); // Send the room as JSON if it exists
});

// player join route
app.post("/api/rooms/:code/players", (req, res) => {
  const code = req.params.code.toUpperCase();
  const displayName =
    typeof req.body?.displayName === "string"
      ? req.body.displayName.trim()
      : ""; // Ensure displayName is a string and trim whitespace

  if (!displayName) {
    return res.status(400).json({
      error: "Display name is required",
    });
  }

  if (displayName.length > 20) {
    return res.status(400).json({
      error: "Display name must be 20 characters or fewer",
    });
  }

  const joinResult = joinRoom(code, displayName);

  if (!joinResult) {
    return res.status(404).json({
      error: "Room not found",
    });
  }

  res.json(joinResult);
});

// player leave route
app.delete("/api/rooms/:code/players/:playerId", (req, res) => {
  const code = req.params.code.toUpperCase();
  const playerId = req.params.playerId;

  const result = leaveRoom(code, playerId);

  if (result.status === "room-not-found") {
    return res.status(404).json({
      error: "Room not found",
    });
  }

  if (result.status === "player-not-found") {
    return res.status(404).json({
      error: "Player not found",
    });
  }

  if (result.status === "room-deleted") {
    return res.status(204).send();
  }

  return res.status(200).json({
    status: "updated",
    room: result.room,
  });
});

// React Router handles page navigation in the browser. For non-API page
// requests, send the same application entry point and let React choose a page.
app.use((req, res, next) => {
  if (req.method !== "GET" || req.path.startsWith("/api/")) {
    return next();
  }

  res.sendFile(path.join(distDirectory, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
