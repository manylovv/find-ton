import { useMemo } from "react";
import { PrizeSquare } from "~/lib/components/game/PrizeSquares";

interface UseGeneratePrizesParams {
  gridSize: number;
  externalPrizes?: PrizeSquare[];
  onPrizesGenerated?: (prizes: PrizeSquare[]) => void;
}

export function useGeneratePrizes({
  gridSize,
  externalPrizes,
  onPrizesGenerated,
}: UseGeneratePrizesParams) {
  const worldTileSize = gridSize / 10;
  const tilesNeeded = Math.ceil(gridSize / worldTileSize);
  const maxCoord = tilesNeeded / 2 - 2;
  const minCoord = -maxCoord;

  const generatedPrizes = useMemo(() => {
    if (externalPrizes && externalPrizes.length > 0) {
      return [];
    }

    const newPrizes: PrizeSquare[] = [];

    const minDistance = Math.max(4, Math.floor((maxCoord - minCoord) / 4));
    console.log(`Minimum distance between prizes: ${minDistance} tiles`);

    const calculateDistance = (x1: number, y1: number, x2: number, y2: number) => {
      return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    };

    const isFarEnough = (x: number, y: number) => {
      for (const prize of newPrizes) {
        const distance = calculateDistance(x, y, prize.x, prize.y);
        if (distance < minDistance) {
          return false;
        }
      }
      return true;
    };

    for (let i = 0; i < 3; i++) {
      let attempts = 0;
      let randomX, randomY;
      let foundPosition = false;

      while (!foundPosition && attempts < 100) {
        randomX = Math.floor(Math.random() * (maxCoord - minCoord + 1)) + minCoord;
        randomY = Math.floor(Math.random() * (maxCoord - minCoord + 1)) + minCoord;

        if (isFarEnough(randomX, randomY)) {
          foundPosition = true;
        }

        attempts++;
      }

      if (!foundPosition) {
        console.warn(
          `Couldn't find an ideal position for prize ${i + 1} after ${attempts} attempts`,
        );

        if (newPrizes.length > 0) {
          console.warn(`Skipping prize ${i + 1} due to space constraints`);
          continue;
        }
      }

      newPrizes.push({
        x: randomX!,
        y: randomY!,
        progress: 0,
        amount: Number(((Math.floor(Math.random() * 10) + 1) * 0.1).toFixed(1)),
      });

      console.log(`Prize ${i + 1} placed at (${randomX}, ${randomY})`);
    }

    if (onPrizesGenerated) {
      onPrizesGenerated(newPrizes);
    }

    return newPrizes;
  }, [gridSize, maxCoord, minCoord, tilesNeeded, onPrizesGenerated, externalPrizes]);

  const prizesToRender =
    externalPrizes && externalPrizes.length > 0 ? externalPrizes : generatedPrizes;

  return { generatedPrizes, prizesToRender };
}
