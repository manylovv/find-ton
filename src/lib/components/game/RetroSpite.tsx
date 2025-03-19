import { useTexture } from "@react-three/drei";
import CameraFollower from "~/lib/components/game/CameraFollower";
import { usePosition } from "~/lib/hooks/usePosition";
import { useSpriteAnimation } from "~/lib/hooks/useSpriteAnimation";
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
  const frameIndex = useSpriteAnimation(isMoving);
  const { positionRef } = usePosition(position, onPositionUpdate);
  const spriteTexture = useSpriteTexture(texture, direction, frameIndex);

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
