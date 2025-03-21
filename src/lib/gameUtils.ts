import { MAX_MINING_PROGRESS, MINING_INCREMENT } from "./constants/mapConstants";
import { useBalanceUpdate } from "./hooks/user/useBalanceUpdate";
import { store } from "./state/game";

export const handleMine = (
  isNearPrize: boolean,
  nearestPrizeIndex: number,
  updateBalanceMutation: ReturnType<typeof useBalanceUpdate>,
) => {
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

    const prizeAmount = updatedPrizes[nearestPrizeIndex].amount;

    console.log(`Mining success! Prize amount: ${prizeAmount} TON)`);

    updateBalanceMutation.mutate({ data: { amount: prizeAmount } });

    setTimeout(() => {
      store.showMiningSuccess = false;
    }, 3000);
  }
};
