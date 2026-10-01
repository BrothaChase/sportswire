import { createRoom } from "./rooms/roomManager.js";
import express from "express";

const app = express();

app.use(express.static("public")); // Serve static files from the "public" directory

app.post("/api/rooms", (req, res) => {
  const room = createRoom();

  res.status(201).json(room); // Send the created room as the response
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
