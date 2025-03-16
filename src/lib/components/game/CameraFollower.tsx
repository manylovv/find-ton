import { useFrame, useThree } from "@react-three/fiber";
import { MutableRefObject } from "react";

interface CameraFollowerProps {
  target: MutableRefObject<[number, number, number]>;
}

function CameraFollower({ target }: CameraFollowerProps) {
  const { camera } = useThree();

  useFrame(() => {
    if (!target.current) return;

    const targetPosition = target.current;

    const newPosition = camera.position.clone();
    newPosition.x = targetPosition[0];
    newPosition.y = targetPosition[1];
    camera.position.copy(newPosition);
  });

  return null;
}

export default CameraFollower;
