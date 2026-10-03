import { makeCode } from "./roomCode.js";
import { randomUUID } from "node:crypto";

const rooms = new Map(); // A map to store all the rooms with their codes as keys

export function createRoom({ name, category, questionCount, format }) {
  let code = makeCode(); // Ex: ABC123

  while (rooms.has(code)) {
    code = makeCode(); // generate a new code if the current one exist already
  }
  //room object
  const room = {
    code,
    name,
    category,
    questionCount,
    format,
    players: [],
    status: "waiting",
  };
  rooms.set(code, room);

  return room;
}

export function getRoom(code) {
  return rooms.get(code);
}

export function joinRoom(code, displayName) {
  const room = getRoom(code);

  if (!room) {
    return null;
  }

  const player = {
    id: randomUUID(),
    name: displayName,
  };

  room.players.push(player);

  return room;
}
