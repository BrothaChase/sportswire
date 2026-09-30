import { createRoom } from "./rooms/roomManager.js";
import express from "express";

const app = express();

app.use(express.static("public")); // Serve static files from the "public" directory

app.post("/api/rooms", (req, res) => {
  const room = createRoom();

  res.status(201).json(room); // Send the created room as the response
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
