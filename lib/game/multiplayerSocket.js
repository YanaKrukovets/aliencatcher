import PartySocket from "partysocket";

const PARTY_HOST = process.env.NEXT_PUBLIC_PARTYKIT_HOST || "localhost:1999";

let socket = null;

export function connect(roomCode, onMessage, onOpen) {
  if (socket) {
    socket.close();
  }

  socket = new PartySocket({
    host: PARTY_HOST,
    room: roomCode,
    party: "game-room",
  });

  socket.addEventListener("open", () => {
    onOpen?.();
  });

  socket.addEventListener("message", (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch {
      // ignore malformed messages
    }
  });

  return socket;
}

export function send(data) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
  }
}

export function disconnect() {
  if (socket) {
    socket.close();
    socket = null;
  }
}
