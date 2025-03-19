import Joystick, { Direction, DirectionCount } from "rc-joystick";
import { memo, useCallback } from "react";
import { useSnapshot } from "valtio";
import {
  PRIZE_INTERACTION_DISTANCE_IN_TILES,
  WORLD_TILE_SIZE,
} from "~/lib/constants/mapConstants";
import { usePrizeInteraction } from "~/lib/hooks/usePrizeInteraction";
import { handleMine, store } from "~/lib/state/game";
import { PrizeSquare } from "./PrizeSquares";

export const ControlUI = memo(() => {
  const { playerPosition, prizeLocations } = useSnapshot(store);

  const { isNearPrize, nearestPrizeIndex } = usePrizeInteraction(
    prizeLocations as PrizeSquare[],
    playerPosition as [number, number, number],
    WORLD_TILE_SIZE,
    PRIZE_INTERACTION_DISTANCE_IN_TILES,
  );

  const handleJoystickChange = useCallback((direction: Direction) => {
    store.joystickDirection = direction === Direction.Center ? null : direction;
  }, []);

  return (
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
        onDirectionChange={handleJoystickChange}
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
  );
});
