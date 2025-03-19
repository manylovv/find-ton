import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import CameraFollower from "~/lib/components/game/CameraFollower";
import useWASDControls from "~/lib/hooks/useWASDControls";
import { JoystickDirectionType } from "~/lib/types/joystick";
import { useSpriteTexture } from "../../hooks/useSpriteTexture";

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
  const spriteTexture = useSpriteTexture(texture, direction, frameIndex);
  const frameRate = 8;
  const frameDuration = 1 / frameRate;

  useEffect(() => {
    positionRef.current = position;

    if (onPositionUpdate) {
      onPositionUpdate(position);
    }
  }, [position, onPositionUpdate]);

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
