import { memo } from "react";
import { useSnapshot } from "valtio";
import { store } from "../../state/game";

const SuccessNotification = memo(() => {
  const { showMiningSuccess, minedPrizesCount, balance } = useSnapshot(store);

  if (!showMiningSuccess) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: "20%",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 100,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        color: "#FFD700",
        padding: "1rem 2rem",
        borderRadius: "1rem",
        fontSize: "1.5rem",
        fontWeight: "bold",
        textAlign: "center",
        animation: "fadeInOut 3s ease-in-out",
      }}
    >
      <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🎉 Success! 🎉</div>
      Prize successfully mined!
      <div style={{ fontSize: "1rem", marginTop: "0.5rem" }}>
        {minedPrizesCount} of 3 prizes collected
      </div>
      <div style={{ fontSize: "1rem", marginTop: "0.5rem" }}>Balance: {balance} TON</div>
    </div>
  );
});

export default SuccessNotification;
