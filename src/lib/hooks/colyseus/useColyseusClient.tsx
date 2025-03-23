import { Room } from "colyseus.js";
import { useEffect, useState } from "react";
import { client } from "~/lib/state/colyseus-client";
import { store } from "~/lib/state/game";

// Types matching the server schemas
interface Player {
  x: number;
  y: number;
  direction?: "down" | "up" | "left" | "right";
  isMoving?: boolean;
  sessionId?: string;
}

interface GameState {
  players: {
    forEach: (callback: (value: Player, key: string) => void) => void;
    size: number;
  };
}

// Define message types
type UpdatePositionMessage = {
  x: number;
  y: number;
  direction: "down" | "up" | "left" | "right";
  isMoving: boolean;
};

type MessagePayload = UpdatePositionMessage | Record<string, unknown>;

// Create a singleton room instance that persists across component renders
let globalRoom: Room | null = null;
let connectionAttempted = false;

export const useColyseusClient = () => {
  const [isConnecting, setIsConnecting] = useState(!globalRoom && !connectionAttempted);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(
    globalRoom?.sessionId || null,
  );

  useEffect(() => {
    // Only try to connect if we haven't already connected or attempted
    if (globalRoom || connectionAttempted) {
      return;
    }

    connectionAttempted = true;

    client
      .joinOrCreate<GameState>("my_room", {})
      .then((room) => {
        globalRoom = room;
        setSessionId(room.sessionId);
        setIsConnecting(false);

        // Update all players when state changes
        room.onStateChange((state) => {
          try {
            const otherPlayers: Record<string, Player> = {};

            if (state && state.players && typeof state.players.forEach === "function") {
              state.players.forEach((player, id) => {
                // Skip our own player
                if (id !== room.sessionId) {
                  otherPlayers[id] = {
                    ...player,
                    sessionId: id,
                  };
                }
              });
            }

            // Update global state with other players
            store.otherPlayers = otherPlayers;
          } catch (e) {
            console.error("Error processing state:", e);
          }
        });

        // Send our position updates to the server
        const sendPosition = () => {
          if (globalRoom && store.playerPosition) {
            try {
              globalRoom.send("updatePosition", {
                x: store.playerPosition[0],
                y: store.playerPosition[1],
                direction: store.playerDirection || "down",
                isMoving: store.playerIsMoving, // Send isMoving state
              });
            } catch (e) {
              console.error("Error sending position:", e);
            }
          }
        };

        // Set up interval to send position updates
        const interval = setInterval(sendPosition, 100); // Reduced frequency to 100ms

        // Handle room error and close events
        room.onError((code, message) => {
          console.error(`Room error: ${code} - ${message}`);
          setError(`Room error: ${message}`);
        });

        room.onLeave(() => {
          console.log("Left room");
          clearInterval(interval);
          globalRoom = null;
          connectionAttempted = false;
        });

        // Clean up function
        return () => {
          clearInterval(interval);
        };
      })
      .catch((err) => {
        setIsConnecting(false);
        setError(`Failed to connect: ${err.message}`);
        console.error("Connection error:", err);
        // Reset connection attempted flag to allow retrying
        connectionAttempted = false;
      });

    // The cleanup function here should NOT leave the room
    // because we're using a global singleton
    return () => {};
  }, []);

  return {
    isConnecting,
    error,
    sessionId,
    // Don't return the room instance directly
    sendMessage: (type: string, message: MessagePayload) => {
      if (globalRoom) {
        globalRoom.send(type, message);
      }
    },
  };
};
