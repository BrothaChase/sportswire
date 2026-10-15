import { makeCode } from "./roomCode.js";
import { randomUUID } from "node:crypto";

const rooms = new Map(); // A map to store all the rooms with their codes as keys

function createPlayer(name, isHost = false) {
  return {
    id: randomUUID(),
    name,
    isHost,
    isReady: true,
  };
}

export function createRoom({
  name,
  category,
  questionCount,
  format,
  hostName,
}) {
  let code = makeCode(); // Ex: ABC123

  while (rooms.has(code)) {
    code = makeCode(); // generate a new code if the current one exist already
  }

  const host = createPlayer(hostName, true);

  //room object
  const room = {
    code,
    name,
    category,
    questionCount,
    format,
    players: [host],
    status: "waiting",
  };
  rooms.set(code, room);

  return {
    room,
    player: host,
  };
}

export function getRoom(code) {
  return rooms.get(code);
}

export function joinRoom(code, displayName) {
  const room = getRoom(code);

  if (!room) {
    return null;
  }

  const player = createPlayer(displayName);

  room.players.push(player);

  return {
    room,
    player,
  };
}
