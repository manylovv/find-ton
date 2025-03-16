import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import CameraFollower from "~/lib/components/game/CameraFollower";
import useWASDControls from "~/lib/hooks/useWASDControls";
import { JoystickDirectionType } from "~/lib/types/joystick";

interface RetroSpriteProps {
  joystickDirection: JoystickDirectionType;
  onPositionUpdate?: (position: [number, number, number]) => void;
}

function RetroSprite({ joystickDirection, onPositionUpdate }: RetroSpriteProps) {
  const texture = useTexture("/assets/Lavender_16x16RetroCharacter.png");
  const { position, direction, isMoving } = useWASDControls(0.25, joystickDirection);
  const [frameIndex, setFrameIndex] = useState(0);
  const frameTimer = useRef(0);
  const positionRef = useRef(position);

  // Update the position reference when position changes
  useEffect(() => {
    positionRef.current = position;

    // Call the onPositionUpdate callback when position changes
    if (onPositionUpdate) {
      onPositionUpdate(position);
    }
  }, [position, onPositionUpdate]);

  const frameRate = 8;
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

  const spriteTexture = useMemo(() => {
    if (!texture) return null;

    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;

    const newTexture = texture.clone();

    const spriteWidth = 16;
    const spriteHeight = 16;
    const sheetWidth = 192;
    const sheetHeight = 160;
    const cols = sheetWidth / spriteWidth;
    const rows = sheetHeight / spriteHeight;

    let row, col;

    switch (direction) {
      case "down":
        row = 0;
        col = frameIndex % 4;
        break;
      case "up":
        row = 0;
        col = 4 + (frameIndex % 4);
        break;
      case "left":
        row = 0;
        col = 8 + (frameIndex % 4);
        break;
      case "right":
        row = 1;
        col = frameIndex % 4;
        break;
      default:
        row = 0;
        col = 0;
    }

    const uMin = col / cols;
    const uMax = (col + 1) / cols;
    const vMin = 1 - (row + 1) / rows;
    const vMax = 1 - row / rows;

    newTexture.offset.set(uMin, vMin);
    newTexture.repeat.set(uMax - uMin, vMax - vMin);
    newTexture.needsUpdate = true;

    return newTexture;
  }, [texture, direction, frameIndex]);

  if (!spriteTexture) return null;

  return (
    <>
      <CameraFollower target={positionRef} />
      <sprite position={position} scale={[3, 3, 1]}>
        <spriteMaterial map={spriteTexture} transparent={true} alphaTest={0.1} />
      </sprite>
    </>
  );
}

export default RetroSprite;
