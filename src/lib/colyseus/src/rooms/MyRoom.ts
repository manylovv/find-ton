import { Client, Room } from "@colyseus/core";
import { MyState, Player } from "./MyState";

export class MyRoom extends Room<MyState> {
  maxClients = 4;
  state = new MyState();

  // Called when the room is created
  onCreate() {
    console.log("Room created!");

    // Register message handler for updatePosition
    this.onMessage("updatePosition", (client, data) => {
      const player = this.state.players.get(client.sessionId);
      if (player) {
        // Track previous position to detect movement
        const prevX = player.x;
        const prevY = player.y;

        // Update position if valid
        if (typeof data.x === "number" && typeof data.y === "number") {
          player.x = data.x;
          player.y = data.y;
        }

        // Update direction if valid
        if (
          typeof data.direction === "string" &&
          ["up", "down", "left", "right"].includes(data.direction)
        ) {
          player.direction = data.direction;
        }

        // Update isMoving based on position change and client data
        if (typeof data.isMoving === "boolean") {
          // If client explicitly sends isMoving state, use it
          player.isMoving = data.isMoving;
        } else {
          // Otherwise calculate based on position change
          const hasMoved =
            Math.abs(player.x - prevX) > 0.001 || Math.abs(player.y - prevY) > 0.001;

          player.isMoving = hasMoved;
        }
      }
    });
  }

  // Called when a client joins the room
  onJoin(client: Client) {
    console.log(`Client ${client.sessionId} joined the game`);
    const player = new Player();
    // Initialize player at origin
    player.x = 0;
    player.y = 0;
    player.direction = "down";
    player.isMoving = false;
    this.state.players.set(client.sessionId, player);
  }

  // Called when a client leaves the room
  onLeave(client: Client) {
    console.log(`Client ${client.sessionId} left the game`);
    this.state.players.delete(client.sessionId);
  }

  // Called when the room is disposed
  onDispose() {
    console.log("Room disposed!");
  }
}
