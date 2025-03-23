import { useTexture } from "@react-three/drei";
import { useEffect, useRef } from "react";
import CameraFollower from "~/lib/components/game/CameraFollower";
import useWASDControls from "~/lib/hooks/control/useWASDControls";
import { usePosition } from "~/lib/hooks/position/usePosition";
import { useSpriteAnimation } from "~/lib/hooks/sprites/useSpriteAnimation";
import { updatePlayerDirection, updatePlayerMoving } from "~/lib/state/game";
import { JoystickDirectionType } from "~/lib/types/joystick";
import { useSpriteTexture } from "../../hooks/sprites/useSpriteTexture";

interface RetroSpriteProps {
  joystickDirection: JoystickDirectionType;
  onPositionUpdate?: (position: [number, number, number]) => void;
}

function RetroSprite({ joystickDirection, onPositionUpdate }: RetroSpriteProps) {
  const texture = useTexture("/assets/Lavender_16x16RetroCharacter.png");
  const { position, direction, isMoving } = useWASDControls(0.25, joystickDirection);
  const prevMovingRef = useRef(false);
  const frameIndex = useSpriteAnimation(isMoving);
  const { positionRef } = usePosition(position, onPositionUpdate);
  const spriteTexture = useSpriteTexture(texture, direction, frameIndex);

  // Update player direction in the state whenever it changes
  useEffect(() => {
    updatePlayerDirection(direction);
  }, [direction]);

  // Update player movement state whenever it changes
  useEffect(() => {
    // Only update if movement state has changed to avoid unnecessary updates
    if (isMoving !== prevMovingRef.current) {
      updatePlayerMoving(isMoving);
      prevMovingRef.current = isMoving;
    }
  }, [isMoving]);

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
