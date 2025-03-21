import Joystick, { Direction, DirectionCount } from "rc-joystick";
import { memo, useCallback } from "react";
import { useSnapshot } from "valtio";
import {
  PRIZE_INTERACTION_DISTANCE_IN_TILES,
  WORLD_TILE_SIZE,
} from "~/lib/constants/mapConstants";
import { handleMine } from "~/lib/gameUtils";
import { usePrizeInteraction } from "~/lib/hooks/prizes/usePrizeInteraction";
import { store } from "~/lib/state/game";

export const ControlUI = memo(() => {
  const { playerPosition, prizeLocations } = useSnapshot(store);

  const { isNearPrize, nearestPrizeIndex } = usePrizeInteraction(
    prizeLocations,
    playerPosition,
    WORLD_TILE_SIZE,
    PRIZE_INTERACTION_DISTANCE_IN_TILES,
  );

  const handleJoystickChange = useCallback((direction: Direction) => {
    store.joystickDirection = direction === Direction.Center ? null : direction;
  }, []);

  return (
    <div
      id="UI-layer"
      className="absolute z-50 bottom-40 px-12 w-full h-16 flex justify-between items-center"
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
          className="text-4xl font-bold text-white text-center border-4 border-white rounded-2xl p-2 bg-black/50 cursor-pointer relative"
        >
          Mine
        </div>
      )}
    </div>
  );
});
