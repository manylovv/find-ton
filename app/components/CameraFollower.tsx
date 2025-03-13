import { useFrame } from "@react-three/fiber";

import { useThree } from "@react-three/fiber";

function CameraFollower({ target }) {
  const { camera } = useThree();

  useFrame(() => {
    if (!target.current) return;

    // Get the current target position
    const targetPosition = target.current;

    // For 2D, directly set the camera position to follow the player
    // This ensures precise movement tracking
    camera.position.x = targetPosition[0];
    camera.position.y = targetPosition[1];
  });

  return null;
}

export default CameraFollower;
