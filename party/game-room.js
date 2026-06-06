/**
 * PartyKit server for AlifallX multiplayer rooms.
 *
 * Each room holds exactly 2 players. First to connect becomes P1 (host),
 * second becomes P2. P1 runs the authoritative game simulation; P2 sends
 * inputs and receives state snapshots.
 *
 * Message routing:
 *   - Any message from P1 is forwarded only to P2.
 *   - Any message from P2 is forwarded only to P1.
 *   - System messages (role assignment, disconnect notices) are sent by the server.
 */

export default class GameRoom {
  constructor(room) {
    this.room = room;
    this.p1 = null;
    this.p2 = null;
  }

  onConnect(connection) {
    if (!this.p1) {
      this.p1 = connection;
      connection.send(JSON.stringify({ type: "role", role: "p1" }));
    } else if (!this.p2) {
      this.p2 = connection;
      connection.send(JSON.stringify({ type: "role", role: "p2" }));
      // Notify both that the room is ready
      const ready = JSON.stringify({ type: "ready" });
      this.p1.send(ready);
      this.p2.send(ready);
    } else {
      // Room full
      connection.send(JSON.stringify({ type: "error", message: "Room is full" }));
      connection.close();
    }
  }

  onMessage(message, sender) {
    if (sender === this.p1 && this.p2) {
      this.p2.send(message);
    } else if (sender === this.p2 && this.p1) {
      this.p1.send(message);
    }
  }

  onClose(connection) {
    if (connection === this.p1) {
      this.p1 = null;
      if (this.p2) {
        this.p2.send(JSON.stringify({ type: "partner-left", role: "p1" }));
      }
    } else if (connection === this.p2) {
      this.p2 = null;
      if (this.p1) {
        this.p1.send(JSON.stringify({ type: "partner-left", role: "p2" }));
      }
    }
  }
}
