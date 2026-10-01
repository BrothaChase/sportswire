import { createRoom, getRoom } from "./rooms/roomManager.js";
import express from "express";

const app = express();

app.use(express.static("public")); // Serve static files from the "public" directory

app.post("/api/rooms", (req, res) => {
  const room = createRoom();

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
