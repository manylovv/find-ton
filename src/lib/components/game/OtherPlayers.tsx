import { Text, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { memo, useEffect, useRef, useState } from "react";
import { useSnapshot } from "valtio";
import { useSpriteAnimation } from "~/lib/hooks/sprites/useSpriteAnimation";
import { useSpriteTexture } from "~/lib/hooks/sprites/useSpriteTexture";
import { store } from "~/lib/state/game";

interface OtherPlayerProps {
  position: [number, number, number];
  direction: "down" | "up" | "left" | "right";
  isMoving: boolean;
  id: string;
}

// Lerp helper function for smooth interpolation
const lerp = (start: number, end: number, t: number): number => {
  return start * (1 - t) + end * t;
};

const OtherPlayer = ({ position, direction, isMoving, id }: OtherPlayerProps) => {
  const texture = useTexture("/assets/Lavender_16x16RetroCharacter.png");

  // Use animation frames based on server-provided movement state
  const frameIndex = useSpriteAnimation(isMoving);

  // Use the provided direction for other players with animation frames
  const spriteTexture = useSpriteTexture(texture, direction, frameIndex);

  // Create refs to track the current and target positions
  const currentPosRef = useRef<[number, number, number]>([
    position[0],
    position[1],
    position[2],
  ]);
  const targetPosRef = useRef<[number, number, number]>([
    position[0],
    position[1],
    position[2],
  ]);

  // State for interpolated position that will be rendered
  const [lerpedPosition, setLerpedPosition] = useState<[number, number, number]>([
    position[0],
    position[1],
    position[2],
  ]);

  // Update target position when server position changes (using useEffect to avoid ref access during render)
  useEffect(() => {
    targetPosRef.current = [position[0], position[1], position[2]];
  }, [position]);

  // Interpolate position in each frame
  useFrame((_, delta) => {
    // Speed of interpolation - adjust as needed for smoothness vs. responsiveness
    const lerpFactor = 8 * delta;

    // Calculate new interpolated position
    const newX = lerp(currentPosRef.current[0], targetPosRef.current[0], lerpFactor);
    const newY = lerp(currentPosRef.current[1], targetPosRef.current[1], lerpFactor);

    // Update current position
    currentPosRef.current = [newX, newY, position[2]];

    // Update state with interpolated position
    setLerpedPosition([newX, newY, position[2]]);
  });

  if (!spriteTexture) return null;

  return (
    <group>
      {/* Player sprite */}
      <sprite position={lerpedPosition} scale={[3, 3, 1]}>
        <spriteMaterial map={spriteTexture} transparent={true} alphaTest={0.1} />
      </sprite>

      {/* Player ID/Label */}
      <Text
        position={[lerpedPosition[0], lerpedPosition[1] + 2, lerpedPosition[2]]}
        color="white"
        fontSize={0.5}
        anchorX="center"
        anchorY="bottom"
        outlineWidth={0.05}
        outlineColor="black"
      >
        {`Player ${id.substring(0, 4)}`}
      </Text>
    </group>
  );
};

interface PlayerData {
  x: number;
  y: number;
  direction?: string;
  isMoving?: boolean;
  sessionId?: string;
}

export const OtherPlayers = memo(() => {
  // We'll use a state-based approach to avoid ref access during render
  const [playerData] = useState(() => new Map<string, PlayerData>());
  const { otherPlayers } = useSnapshot(store);

  if (!otherPlayers || Object.keys(otherPlayers).length === 0) {
    return null;
  }

  return (
    <>
      {Object.entries(otherPlayers).map(([id, player]) => {
        const currentPos: [number, number, number] = [player.x, player.y, 0];

        // Get validated direction with fallback
        const playerDirection =
          player.direction && ["up", "down", "left", "right"].includes(player.direction)
            ? (player.direction as "up" | "down" | "left" | "right")
            : "down";

        // Get movement state with fallback
        const playerIsMoving =
          typeof player.isMoving === "boolean" ? player.isMoving : false;

        // Store current player data without accessing ref during render
        playerData.set(id, { ...player });

        return (
          <OtherPlayer
            key={id}
            id={id}
            position={currentPos}
            direction={playerDirection}
            isMoving={playerIsMoving}
          />
        );
      })}
    </>
  );
});
