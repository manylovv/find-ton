import GameGrid from "./GameGrid";

import { Canvas } from "@react-three/fiber";
import RetroSprite from "./RetroSpite";
import Joystick, { Direction, DirectionCount } from "rc-joystick";
import { OrthographicCamera } from "@react-three/drei";
import { useEffect } from "react";
import { JoystickDirectionType } from "@/types/joystick";
import { useState } from "react";

function Home() {
  const [initialized, setInitialized] = useState(false);
  const [joystickDirection, setJoystickDirection] =
    useState<JoystickDirectionType>(null);

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "hidden";
    setInitialized(true);

    return () => {
      document.body.style.margin = "";
      document.body.style.padding = "";
      document.body.style.overflow = "";
    };
  }, []);

  if (!initialized) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}>
      <div
        style={{
          position: "absolute",
          zIndex: 50,
          bottom: "10rem",
          left: 0,
          width: "100%",
          height: "4rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <Joystick
          baseRadius={60}
          controllerRadius={30}
          onDirectionChange={(direction) => {
            setJoystickDirection(
              direction === Direction.Center ? null : direction
            );
          }}
          throttle={50}
          insideMode={true}
          directionCount={DirectionCount.Nine}
        />
      </div>
      <Canvas
        style={{
          width: "100vw",
          height: "100vh",
        }}>
        <color attach="background" args={["#87CEEB"]} />
        <OrthographicCamera
          makeDefault
          position={[0, 0, 100]}
          zoom={15}
          near={0.1}
          far={1000}
        />
        <ambientLight intensity={1} />
        <GameGrid />
        <RetroSprite joystickDirection={joystickDirection} />
      </Canvas>
    </div>
  );
}

export default Home;
