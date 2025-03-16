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
  const [nearestPrizeIndex, setNearestPrizeIndex] = useState<number>(-1);
  const [showMiningSuccess, setShowMiningSuccess] = useState(false);
  const [minedPrizesCount, setMinedPrizesCount] = useState(0);
  const [balance, setBalance] = useState(0);

  // Grid size should match the one in GameGrid
  const gridSize = 20;
  // World tile size calculation (should match the one in GameGrid)
  const worldTileSize = gridSize / 10;

  // Distance threshold for showing the Mine button (in tile units)
  // Set to exactly 2 tiles as requested
  const PRIZE_INTERACTION_DISTANCE_IN_TILES = 2;

  // Convert tile distance to world units
  const PRIZE_INTERACTION_DISTANCE =
    PRIZE_INTERACTION_DISTANCE_IN_TILES * worldTileSize;

  // Mining increment value
  const MINING_INCREMENT = 5;
  const MAX_MINING_PROGRESS = 100;

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
    let closestPrizeIndex = -1;
    let isNear = false;

    // Calculate if player is near any prize
    for (let i = 0; i < prizeLocations.length; i++) {
      const prize = prizeLocations[i];

      // Skip prizes that are fully mined
      if (prize.progress >= MAX_MINING_PROGRESS) continue;

      // Calculate Manhattan distance (grid-based distance)
      const xDistance = Math.abs(prize.x - playerTileX);
      const yDistance = Math.abs(prize.y - playerTileY);

      // Use Manhattan distance for a more grid-like interaction
      const distance = Math.max(xDistance, yDistance);

      // Track the nearest prize
      if (distance < nearestDistance) {
        nearestDistance = distance;
        closestPrize = prize;
        closestPrizeIndex = i;
      }

      // Check if within interaction distance
      if (distance <= PRIZE_INTERACTION_DISTANCE_IN_TILES) {
        isNear = true;
      }
    }

    setIsNearPrize(isNear);
    setNearestPrize(closestPrize);
    setNearestPrizeIndex(closestPrizeIndex);

    // Debug information
    if (isNear && closestPrize) {
      console.log(
        `Player near prize at (${closestPrize.x}, ${closestPrize.y}), distance: ${nearestDistance.toFixed(2)} tiles, progress: ${closestPrize.progress}%`
      );
    }
  }, [
    playerPosition,
    prizeLocations,
    worldTileSize,
    PRIZE_INTERACTION_DISTANCE_IN_TILES,
    MAX_MINING_PROGRESS,
  ]);

  // Handler for player position updates
  const handlePlayerPositionUpdate = (position: [number, number, number]) => {
    setPlayerPosition(position);
  };

  // Handler for mining a prize
  const handleMine = () => {
    if (!isNearPrize || nearestPrizeIndex === -1) return;

    // Create a copy of the prize locations array
    const updatedPrizes = [...prizeLocations];

    // Increment the progress of the nearest prize
    updatedPrizes[nearestPrizeIndex] = {
      ...updatedPrizes[nearestPrizeIndex],
      progress: Math.min(
        updatedPrizes[nearestPrizeIndex].progress + MINING_INCREMENT,
        MAX_MINING_PROGRESS
      ),
    };

    // Update the state with the new progress
    setPrizeLocations(updatedPrizes);

    // Log the mining action
    console.log(
      `Mining prize at (${updatedPrizes[nearestPrizeIndex].x}, ${updatedPrizes[nearestPrizeIndex].y}), progress: ${updatedPrizes[nearestPrizeIndex].progress}%`
    );

    // Check if the prize is fully mined
    if (updatedPrizes[nearestPrizeIndex].progress >= MAX_MINING_PROGRESS) {
      console.log(
        `Prize at (${updatedPrizes[nearestPrizeIndex].x}, ${updatedPrizes[nearestPrizeIndex].y}) fully mined!`
      );

      // Show success message
      setShowMiningSuccess(true);

      // Increment mined prizes count
      setMinedPrizesCount((prev) => prev + 1);
      setBalance((prev) => prev + updatedPrizes[nearestPrizeIndex].amount);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowMiningSuccess(false);
      }, 3000);
    }
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
        style={{
          position: "fixed",
          top: "1rem",
          left: "1rem",
          fontSize: "1rem",
          color: "white",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          padding: "0.5rem",
          borderRadius: "0.5rem",
          zIndex: 100,
        }}>
        Balance: {balance} TON
      </div>
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
        {isNearPrize && nearestPrize && (
          <div
            onClick={handleMine}
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "white",
              textAlign: "center",
              border: "4px solid white",
              borderRadius: "1rem",
              padding: "0.5rem",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              cursor: "pointer",
              position: "relative",
            }}>
            Mine
          </div>
        )}
      </div>

      {/* Mining success message */}
      {showMiningSuccess && (
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 100,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "#FFD700", // Gold color
            padding: "1rem 2rem",
            borderRadius: "1rem",
            fontSize: "1.5rem",
            fontWeight: "bold",
            textAlign: "center",
            animation: "fadeInOut 3s ease-in-out",
          }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
            🎉 Success! 🎉
          </div>
          Prize successfully mined!
          <div style={{ fontSize: "1rem", marginTop: "0.5rem" }}>
            {minedPrizesCount} of 3 prizes collected
          </div>
          <div style={{ fontSize: "1rem", marginTop: "0.5rem" }}>
            Balance: {balance} TON
          </div>
        </div>
      )}

      {/* Add CSS animation for the success message */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(-20px) translateX(-50%); }
            15% { opacity: 1; transform: translateY(0) translateX(-50%); }
            85% { opacity: 1; transform: translateY(0) translateX(-50%); }
            100% { opacity: 0; transform: translateY(-20px) translateX(-50%); }
          }
        `,
        }}
      />

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
        <GameGrid
          onPrizesGenerated={setPrizeLocations}
          prizeLocations={prizeLocations}
        />
        <RetroSprite
          joystickDirection={joystickDirection}
          onPositionUpdate={handlePlayerPositionUpdate}
        />
      </Canvas>
    </div>
  );
}

export default Home;
