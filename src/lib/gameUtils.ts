import { MAX_MINING_PROGRESS, MINING_INCREMENT } from "./constants/mapConstants";
import { store } from "./state/game";

export const handleMine = (isNearPrize: boolean, nearestPrizeIndex: number) => {
  if (!isNearPrize || nearestPrizeIndex === -1) return;

  const updatedPrizes = [...store.prizeLocations];
  updatedPrizes[nearestPrizeIndex] = {
    ...updatedPrizes[nearestPrizeIndex],
    progress: Math.min(
      updatedPrizes[nearestPrizeIndex].progress + MINING_INCREMENT,
      MAX_MINING_PROGRESS,
    ),
  };

  store.prizeLocations = updatedPrizes;

  if (updatedPrizes[nearestPrizeIndex].progress >= MAX_MINING_PROGRESS) {
    store.showMiningSuccess = true;
    store.minedPrizesCount += 1;
    store.balance += updatedPrizes[nearestPrizeIndex].amount;

    setTimeout(() => {
      store.showMiningSuccess = false;
    }, 3000);
  }
};
