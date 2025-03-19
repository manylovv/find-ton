import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";

export function useSpriteAnimation(isMoving: boolean, frameRate = 8) {
  const [frameIndex, setFrameIndex] = useState(0);
  const frameTimer = useRef(0);
  const frameDuration = 1 / frameRate;

  useFrame((_, delta) => {
    if (isMoving) {
      frameTimer.current += delta;

      if (frameTimer.current >= frameDuration) {
        frameTimer.current = 0;
        setFrameIndex((prev) => (prev + 1) % 4);
      }
    } else {
      setFrameIndex(0);
    }
  });

  return frameIndex;
}
