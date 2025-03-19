import { OrthographicCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { memo, useCallback } from "react";
import { useSnapshot } from "valtio";
import { store, updatePlayerPosition, updatePrizeLocations } from "~/lib/state/game";
import GameGrid from "./GameGrid";
import { PrizeSquare } from "./PrizeSquares";
import RetroSprite from "./RetroSpite";

export const GameWorld = memo(() => {
  const { joystickDirection, prizeLocations } = useSnapshot(store);

  const handlePositionUpdate = useCallback((position: [number, number, number]) => {
    updatePlayerPosition(position);
  }, []);

  return (
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
        prizeLocations={prizeLocations as PrizeSquare[]}
      />
      <RetroSprite
        joystickDirection={joystickDirection}
        onPositionUpdate={handlePositionUpdate}
      />
    </Canvas>
  );
});
