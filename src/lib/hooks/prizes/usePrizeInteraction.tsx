import { useEffect, useState } from "react";
import { PrizeSquare } from "~/lib/components/game/PrizeSquares";
import { MAX_MINING_PROGRESS } from "~/lib/constants/mapConstants";

export function usePrizeInteraction(
  prizeLocations: readonly PrizeSquare[],
  playerPosition: readonly [number, number, number],
  worldTileSize: number,
  interactionDistanceInTiles: number,
) {
  const [isNearPrize, setIsNearPrize] = useState(false);
  const [nearestPrizeIndex, setNearestPrizeIndex] = useState(-1);

  useEffect(() => {
    if (prizeLocations.length === 0 || !playerPosition) return;

    const playerTileX = playerPosition[0] / worldTileSize;
    const playerTileY = playerPosition[1] / worldTileSize;

    let nearestDistance = Infinity;
    let closestPrizeIndex = -1;
    let isNear = false;

    for (let i = 0; i < prizeLocations.length; i++) {
      const prize = prizeLocations[i];
      if (prize.progress >= MAX_MINING_PROGRESS) continue;

      const xDistance = Math.abs(prize.x - playerTileX);
      const yDistance = Math.abs(prize.y - playerTileY);
      const distance = Math.max(xDistance, yDistance);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        closestPrizeIndex = i;
      }

      if (distance <= interactionDistanceInTiles) {
        isNear = true;
      }
    }

    setIsNearPrize(isNear);
    setNearestPrizeIndex(closestPrizeIndex);
  }, [prizeLocations, playerPosition, worldTileSize, interactionDistanceInTiles]);

  return { isNearPrize, nearestPrizeIndex };
}
