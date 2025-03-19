import { memo } from "react";
import { useSnapshot } from "valtio";
import { store } from "../../state/game";

const SuccessNotification = memo(() => {
  const { showMiningSuccess, minedPrizesCount, balance } = useSnapshot(store);

  if (!showMiningSuccess) return null;

  return (
    <div className="absolute top-[20%] left-1/2 -translate-x-1/2 z-100 bg-black/80 text-yellow-400 px-8 py-4 rounded-2xl text-2xl font-bold text-center animate-fadeInOut">
      <div className="text-4xl mb-2">🎉 Success! 🎉</div>
      Prize successfully mined!
      <div className="text-base mt-2">{minedPrizesCount} of 3 prizes collected</div>
      <div className="text-base mt-2">Balance: {balance} TON</div>
    </div>
  );
});

export default SuccessNotification;
