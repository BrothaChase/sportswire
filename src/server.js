import { createRoom, getRoom, joinRoom } from "./rooms/roomManager.js";
import express from "express";

const app = express();

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
app.use(express.static("public")); // Serve static files from the "public" directory

app.post("/api/rooms", (req, res) => {
  const { name, category, questionCount, format } = req.body ?? {};
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

  const room = createRoom({
    name: roomName,
    category,
    questionCount: parsedQuestionCount,
    format,
  });

  res.status(201).json(room); // Send the created room as the response
});

app.get("/api/rooms/:code", (req, res) => {
  // :code is a route parameter representing the room code
  const code = req.params.code.toUpperCase();
  const room = getRoom(code); // Retrieve the room with the given code

  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }

  res.json(room); // Send the room as JSON if it exists
});

app.post("/api/rooms/:code/players", (req, res) => {
  const code = req.params.code.toUpperCase();
  const displayName = req.body.displayName?.trim(); // trim any leading/trailing whitespace from the display name

  if (!displayName) {
    return res.status(400).json({
      error: "Display name is required",
    });
  }

  const room = joinRoom(code, displayName);

  if (!room) {
    return res.status(404).json({
      error: "Room not found",
    });
  }

  res.json(room);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
