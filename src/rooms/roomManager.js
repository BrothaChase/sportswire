import { makeCode } from "./roomCode.js";

const rooms = new Map(); // A map to store all the rooms with their codes as keys

function createRoom() {
  let code = makeCode(); // Ex: ABC123

  while (rooms.has(code)) {
    code = makeCode(); // generate a new code if the current one exist already
  }
  //room object
  const room = {
    code,
    players: [],
    status: "waiting",
  };
  rooms.set(code, room);

  return room;
}
