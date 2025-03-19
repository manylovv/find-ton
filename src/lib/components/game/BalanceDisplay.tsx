import { memo } from "react";
import { useSnapshot } from "valtio";
import { store } from "~/lib/state/game";

export const BalanceDisplay = memo(() => {
  const { balance } = useSnapshot(store);

  return (
    <div
      style={{
        position: "fixed",
        top: "1rem",
        left: "1rem",
        fontSize: "1rem",
        color: "white",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        padding: "0.5rem",
        borderRadius: "0.5rem",
        zIndex: 100,
      }}
    >
      Balance: {balance} TON
    </div>
  );
});
