import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";

/**
 * Custom hook for handling sprite animation frames
 * @param isMoving Boolean indicating if the sprite is moving
 * @param frameRate Number of frames per second
 * @returns Current frame index for the animation
 */
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
