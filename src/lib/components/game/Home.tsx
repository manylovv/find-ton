import GameGrid from "./GameGrid";

import { OrthographicCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Joystick, { Direction, DirectionCount } from "rc-joystick";
import { useEffect, useState } from "react";
import { JoystickDirectionType } from "~/lib/types/joystick";
import { PrizeSquare } from "./PrizeSquares";
import RetroSprite from "./RetroSpite";
import { MAX_MINING_PROGRESS, MINING_INCREMENT, PRIZE_INTERACTION_DISTANCE_IN_TILES, WORLD_TILE_SIZE } from "~/lib/constants/mapConstants";
import { usePrizeInteraction } from "~/lib/hooks/usePrizeInteraction";

function Home() {
  const [initialized, setInitialized] = useState(false);
  const [joystickDirection, setJoystickDirection] = useState<JoystickDirectionType>(null);
  const [prizeLocations, setPrizeLocations] = useState<PrizeSquare[]>([]);
  const [playerPosition, setPlayerPosition] = useState<[number, number, number]>([
    0, 0, 0,
  ]);
 const { isNearPrize, nearestPrizeIndex } = usePrizeInteraction(
    prizeLocations,
    playerPosition,
    WORLD_TILE_SIZE,
    PRIZE_INTERACTION_DISTANCE_IN_TILES
  );
  const [showMiningSuccess, setShowMiningSuccess] = useState(false);
  const [minedPrizesCount, setMinedPrizesCount] = useState(0);
  const [balance, setBalance] = useState(0);

  console.log("rendering Home");

  // Grid size should match the one in GameGrid

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "hidden";
    // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
    setInitialized(true);

    return () => {
      document.body.style.margin = "";
      document.body.style.padding = "";
      document.body.style.overflow = "";
    };
  }, []);

  // Check if player is near any prize
  

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
        MAX_MINING_PROGRESS,
      ),
    };

    // Update the state with the new progress
    setPrizeLocations(updatedPrizes);

    // Log the mining action
    console.log(
      `Mining prize at (${updatedPrizes[nearestPrizeIndex].x}, ${updatedPrizes[nearestPrizeIndex].y}), progress: ${updatedPrizes[nearestPrizeIndex].progress}%`,
    );

    // Check if the prize is fully mined
    if (updatedPrizes[nearestPrizeIndex].progress >= MAX_MINING_PROGRESS) {
      console.log(
        `Prize at (${updatedPrizes[nearestPrizeIndex].x}, ${updatedPrizes[nearestPrizeIndex].y}) fully mined!`,
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
      }}
    >
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
        }}
      >
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
        }}
      >
        <Joystick
          baseRadius={60}
          controllerRadius={30}
          onDirectionChange={(direction) => {
            setJoystickDirection(direction === Direction.Center ? null : direction);
          }}
          throttle={50}
          insideMode={true}
          directionCount={DirectionCount.Nine}
        />
        {isNearPrize && (
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
            }}
          >
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
          }}
        >
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🎉 Success! 🎉</div>
          Prize successfully mined!
          <div style={{ fontSize: "1rem", marginTop: "0.5rem" }}>
            {minedPrizesCount} of 3 prizes collected
          </div>
          <div style={{ fontSize: "1rem", marginTop: "0.5rem" }}>
            Balance: {balance} TON
          </div>
        </div>
      )}

      <Canvas
        id="threejs-layer"
        style={{
          width: "100vw",
          height: "100vh",
        }}
      >
        <color attach="background" args={["#87CEEB"]} />
        <OrthographicCamera
          makeDefault
          position={[0, 0, 100]}
          zoom={15}
          near={0.1}
          far={1000}
        />
        <ambientLight intensity={1} />
        <GameGrid onPrizesGenerated={setPrizeLocations} prizeLocations={prizeLocations} />
        <RetroSprite
          joystickDirection={joystickDirection}
          onPositionUpdate={handlePlayerPositionUpdate}
        />
      </Canvas>
    </div>
  );
}

export default Home;
