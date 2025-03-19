import { MAX_MINING_PROGRESS, MINING_INCREMENT } from "./constants/mapConstants";
import { PrizeSquare } from "./components/game/PrizeSquares";

export const minePrize = (
  isNearPrize: boolean, 
  nearestPrizeIndex: number, 
  prizeLocations: PrizeSquare[], 
  setPrizeLocations: (prev: PrizeSquare[]) => void, 
  setShowMiningSuccess: (prev: boolean) => void, 
  setMinedPrizesCount: (prev: number) => void, 
  setBalance: (prev: number) => void
) => {
  if (!isNearPrize || nearestPrizeIndex === -1) return;

  const updatedPrizes = [...prizeLocations];

  updatedPrizes[nearestPrizeIndex] = {
    ...updatedPrizes[nearestPrizeIndex],
    progress: Math.min(
      updatedPrizes[nearestPrizeIndex].progress + MINING_INCREMENT, 
      MAX_MINING_PROGRESS,
    ),
  };

  setPrizeLocations(updatedPrizes);

  if (updatedPrizes[nearestPrizeIndex].progress >= MAX_MINING_PROGRESS) {
    setShowMiningSuccess(true);

    setTimeout(() => {
      setShowMiningSuccess(false);
    }, 3000);
  }
};