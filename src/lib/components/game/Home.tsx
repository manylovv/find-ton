import GameGrid from "./GameGrid";
import { OrthographicCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Joystick, { Direction, DirectionCount } from "rc-joystick";
import { useEffect } from "react";
import { PrizeSquare } from "./PrizeSquares";
import RetroSprite from "./RetroSpite";
import { PRIZE_INTERACTION_DISTANCE_IN_TILES, WORLD_TILE_SIZE } from "~/lib/constants/mapConstants";
import { usePrizeInteraction } from "~/lib/hooks/usePrizeInteraction";
import { store, initializeGame, updatePlayerPosition, handleMine, updatePrizeLocations } from "~/lib/state/game";
import { useSnapshot } from "valtio";

function Home() {
  const snap = useSnapshot(store);
  const { isNearPrize, nearestPrizeIndex } = usePrizeInteraction(
    snap.prizeLocations as PrizeSquare[],
    snap.playerPosition as [number, number, number],
    WORLD_TILE_SIZE,
    PRIZE_INTERACTION_DISTANCE_IN_TILES
  );

  useEffect(() => {
    const cleanup = initializeGame();
    return cleanup;
  }, []);

  if (!snap.initialized) {
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
        Balance: {snap.balance} TON
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
            store.joystickDirection = direction === Direction.Center ? null : direction;
          }}
          throttle={50}
          insideMode={true}
          directionCount={DirectionCount.Nine}
        />
        {isNearPrize && (
          <div
            onClick={() => handleMine(isNearPrize, nearestPrizeIndex)}
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

      {snap.showMiningSuccess && (
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 100,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "#FFD700",
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
            {snap.minedPrizesCount} of 3 prizes collected
          </div>
          <div style={{ fontSize: "1rem", marginTop: "0.5rem" }}>
            Balance: {snap.balance} TON
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
        <GameGrid 
          onPrizesGenerated={updatePrizeLocations} 
          prizeLocations={snap.prizeLocations as PrizeSquare[]} 
        />
        <RetroSprite
          joystickDirection={snap.joystickDirection}
          onPositionUpdate={updatePlayerPosition}
        />
      </Canvas>
    </div>
  );
}

export default Home;
