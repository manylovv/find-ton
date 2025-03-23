import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/colyseus")({
  component: RoomComponent,
});

import { Client, Room } from "colyseus.js";
import { useEffect, useRef, useState } from "react";

// Client connection
const client = new Client("http://localhost:2567");

// Types matching the server schemas
interface Player {
  x: number;
  y: number;
  sessionId?: string; // Added for tracking
}

// Properly type the players collection based on Colyseus MapSchema
interface GameState {
  players: {
    // MapSchema behaves like a Map
    forEach: (callback: (value: Player, key: string) => void) => void;
    // Other necessary methods we might need
    size: number;
  };
}

function RoomComponent() {
  const roomRef = useRef<Room | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [players, setPlayers] = useState<Record<string, Player>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Try to join or create the room
    client
      .joinOrCreate<GameState>("my_room", {})
      .then((room) => {
        roomRef.current = room;
        setIsConnecting(false);

        // Handle state changes with the correct schema structure
        room.onStateChange((state) => {
          const playerMap: Record<string, Player> = {};

          // Convert MapSchema to a regular object for React
          state.players.forEach((player, sessionId) => {
            playerMap[sessionId] = {
              ...player,
              sessionId,
            };
          });

          setPlayers(playerMap);
        });
      })
      .catch((err) => {
        setIsConnecting(false);
        setError(`Failed to connect: ${err.message}`);
        console.error("Connection error:", err);
      });

    // Cleanup function
    return () => {
      if (roomRef.current) {
        roomRef.current.leave();
      }
    };
  }, []);

  // Error handling
  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  // Render players
  return (
    <div>
      {isConnecting ? (
        <div>Connecting to game server...</div>
      ) : (
        <div>
          <h2>Connected Players</h2>
          {Object.keys(players).length === 0 ? (
            <div>No players connected yet</div>
          ) : (
            <div className="players-list">
              {Object.entries(players).map(([sessionId, player]) => (
                <div key={sessionId} className="player-item">
                  Player at position: ({player.x}, {player.y})
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
