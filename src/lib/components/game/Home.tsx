import { useEffect } from "react";
import { useSnapshot } from "valtio";
import { initializeGame, store } from "~/lib/state/game";
import { BalanceDisplay } from "./BalanceDisplay";
import { ControlUI } from "./ControlUI";
import SuccessNotification from "./SuccessNotification";
import { GameWorld } from "./ThreeLayer";

function Home() {
  const { initialized } = useSnapshot(store);

  useEffect(() => {
    return initializeGame();
  }, []);

  if (!initialized) {
    return <div>Loading...</div>;
  }

  console.log("rendering home");

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <BalanceDisplay />
      <ControlUI />
      <SuccessNotification />
      <GameWorld />
    </div>
  );
}

export default Home;
