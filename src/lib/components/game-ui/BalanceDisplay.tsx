import { memo } from "react";
import { useSnapshot } from "valtio";
import { store } from "~/lib/state/game";

export const BalanceDisplay = memo(() => {
  const { balance } = useSnapshot(store);

  return (
    <div className="fixed top-4 left-4 text-base text-white bg-black/50 p-2 rounded-lg z-100">
      Balance: {balance} TON
    </div>
  );
});
