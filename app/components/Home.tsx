import GameGrid from "./GameGrid";

import { Canvas } from "@react-three/fiber";
import RetroSprite from "./RetroSpite";
import Joystick, { Direction, DirectionCount } from "rc-joystick";
import { OrthographicCamera } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { JoystickDirectionType } from "@/types/joystick";
import { useState } from "react";
import { PrizeSquare } from "./PrizeSquares";

function Home() {
  const [initialized, setInitialized] = useState(false);
  const [joystickDirection, setJoystickDirection] =
    useState<JoystickDirectionType>(null);
  const [prizeLocations, setPrizeLocations] = useState<PrizeSquare[]>([]);
  const [playerPosition, setPlayerPosition] = useState<
    [number, number, number]
  >([0, 0, 0]);
  const [isNearPrize, setIsNearPrize] = useState(false);
  const [nearestPrize, setNearestPrize] = useState<PrizeSquare | null>(null);

  // Grid size should match the one in GameGrid
  const gridSize = 100;
  // World tile size calculation (should match the one in GameGrid)
  const worldTileSize = gridSize / 50;

  // Distance threshold for showing the Mine button (in tile units)
  // Set to exactly 2 tiles as requested
  const PRIZE_INTERACTION_DISTANCE_IN_TILES = 2;

  // Convert tile distance to world units
  const PRIZE_INTERACTION_DISTANCE =
    PRIZE_INTERACTION_DISTANCE_IN_TILES * worldTileSize;

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "hidden";
    setInitialized(true);

    return () => {
      document.body.style.margin = "";
      document.body.style.padding = "";
      document.body.style.overflow = "";
    };
  }, []);

  // Check if player is near any prize
  useEffect(() => {
    if (prizeLocations.length === 0 || !playerPosition) return;

    // Convert player position from world units to tile coordinates
    const playerTileX = playerPosition[0] / worldTileSize;
    const playerTileY = playerPosition[1] / worldTileSize;

    let nearestDistance = Infinity;
    let closestPrize: PrizeSquare | null = null;
    let isNear = false;

    // Calculate if player is near any prize
    for (const prize of prizeLocations) {
      // Calculate Manhattan distance (grid-based distance)
      const xDistance = Math.abs(prize.x - playerTileX);
      const yDistance = Math.abs(prize.y - playerTileY);

      // Use Manhattan distance for a more grid-like interaction
      const distance = Math.max(xDistance, yDistance);

      // Track the nearest prize
      if (distance < nearestDistance) {
        nearestDistance = distance;
        closestPrize = prize;
      }

      // Check if within interaction distance
      if (distance <= PRIZE_INTERACTION_DISTANCE_IN_TILES) {
        isNear = true;
      }
    }

    setIsNearPrize(isNear);
    setNearestPrize(closestPrize);

    // Debug information
    if (isNear && closestPrize) {
      console.log(
        `Player near prize at (${closestPrize.x}, ${closestPrize.y}), distance: ${nearestDistance.toFixed(2)} tiles`
      );
    }
  }, [
    playerPosition,
    prizeLocations,
    worldTileSize,
    PRIZE_INTERACTION_DISTANCE_IN_TILES,
  ]);

  // Handler for player position updates
  const handlePlayerPositionUpdate = (position: [number, number, number]) => {
    setPlayerPosition(position);
  };

  if (!initialized) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}>
      <div
        id="UI-layer"
        style={{
          position: "absolute",
          zIndex: 50,
          bottom: "10rem",
          padding: "0 3rem",
          width: "100%",
          height: "4rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <Joystick
          baseRadius={60}
          controllerRadius={30}
          onDirectionChange={(direction) => {
            setJoystickDirection(
              direction === Direction.Center ? null : direction
            );
          }}
          throttle={50}
          insideMode={true}
          directionCount={DirectionCount.Nine}
        />
        {isNearPrize && (
          <div
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "white",
              textAlign: "center",
              border: "4px solid white",
              borderRadius: "1rem",
              padding: "0.5rem",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}>
            Mine
          </div>
        )}
      </div>

      <Canvas
        id="threejs-layer"
        style={{
          width: "100vw",
          height: "100vh",
        }}>
        <color attach="background" args={["#87CEEB"]} />
        <OrthographicCamera
          makeDefault
          position={[0, 0, 100]}
          zoom={15}
          near={0.1}
          far={1000}
        />
        <ambientLight intensity={1} />
        <GameGrid onPrizesGenerated={setPrizeLocations} />
        <RetroSprite
          joystickDirection={joystickDirection}
          onPositionUpdate={handlePlayerPositionUpdate}
        />
      </Canvas>
    </div>
  );
}

export default Home;
