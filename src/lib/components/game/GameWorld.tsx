import { OrthographicCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { memo, useCallback, useEffect } from "react";
import { useSnapshot } from "valtio";
import { useColyseusClient } from "~/lib/hooks/colyseus/useColyseusClient";
import { store, updatePlayerPosition, updatePrizeLocations } from "~/lib/state/game";
import GameGrid from "./GameGrid";
import { OtherPlayers } from "./OtherPlayers";
import { PrizeSquare } from "./PrizeSquares";
import RetroSprite from "./RetroSpite";

export const GameWorld = memo(() => {
  const { joystickDirection, prizeLocations, connectionError, isConnectingToServer } =
    useSnapshot(store);
  const { isConnecting, error } = useColyseusClient();

  // Update connection status in the main state
  useEffect(() => {
    store.isConnectingToServer = isConnecting;
    if (error) store.connectionError = error;
  }, [isConnecting, error]);

  const handlePositionUpdate = useCallback((position: [number, number, number]) => {
    updatePlayerPosition(position);
  }, []);

  if (connectionError || store.connectionError) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-red-100 text-red-800 p-4">
        Connection error: {connectionError || store.connectionError}
      </div>
    );
  }

  return (
    <>
      {isConnectingToServer && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 text-white">
          Connecting to game server...
        </div>
      )}

      <Canvas id="threejs-layer" className="w-screen h-screen">
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
        <OtherPlayers />
      </Canvas>
    </>
  );
});
