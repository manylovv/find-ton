import { useState, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Direction } from "rc-joystick";
import { JoystickDirectionType } from "@/types/joystick";

function useWASDControls(
  speed = 0.3,
  joystickDirection: JoystickDirectionType = null
) {
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);
  const keysPressed = useRef<Record<string, boolean>>({});
  const [direction, setDirection] = useState<"down" | "up" | "left" | "right">(
    "down"
  );
  const [isMoving, setIsMoving] = useState(false);
  const joystickDirectionRef = useRef(joystickDirection);

  // Define game area boundaries - adjust to fix movement constraints
  // Add an offset to fix the left/right movement issues
  const gameAreaWidth = 100;
  const gameAreaHeight = 99;
  const leftOffset = 0; // Add offset for left side
  const rightOffset = 2; // Add offset for right side
  const halfWidth = gameAreaWidth / 2;
  const halfHeight = gameAreaHeight / 2;

  useEffect(() => {
    joystickDirectionRef.current = joystickDirection;
  }, [joystickDirection]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.key.toLowerCase()] = true;
    };

    const handleKeyUp = (e) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame(() => {
    const newPosition: [number, number, number] = [...position] as [
      number,
      number,
      number,
    ];

    let moving = false;

    // Handle keyboard input with higher priority
    if (keysPressed.current["w"] || keysPressed.current["arrowup"]) {
      newPosition[1] += speed;
      setDirection("up");
      moving = true;
    }
    if (keysPressed.current["s"] || keysPressed.current["arrowdown"]) {
      newPosition[1] -= speed;
      setDirection("down");
      moving = true;
    }
    if (keysPressed.current["a"] || keysPressed.current["arrowleft"]) {
      newPosition[0] -= speed;
      setDirection("left");
      moving = true;
    }
    if (keysPressed.current["d"] || keysPressed.current["arrowright"]) {
      newPosition[0] += speed;
      setDirection("right");
      moving = true;
    }

    // Handle joystick input
    if (joystickDirectionRef.current && !moving) {
      switch (joystickDirectionRef.current) {
        case Direction.Top:
          newPosition[1] += speed;
          setDirection("up");
          moving = true;
          break;
        case Direction.Bottom:
          newPosition[1] -= speed;
          setDirection("down");
          moving = true;
          break;
        case Direction.Left:
          newPosition[0] -= speed;
          setDirection("left");
          moving = true;
          break;
        case Direction.Right:
          newPosition[0] += speed;
          setDirection("right");
          moving = true;
          break;
        case Direction.RightTop:
          newPosition[0] += speed * 0.7;
          newPosition[1] += speed * 0.7;
          setDirection("right");
          moving = true;
          break;
        case Direction.BottomRight:
          newPosition[0] += speed * 0.7;
          newPosition[1] -= speed * 0.7;
          setDirection("right");
          moving = true;
          break;
        case Direction.TopLeft:
          newPosition[0] -= speed * 0.7;
          newPosition[1] += speed * 0.7;
          setDirection("left");
          moving = true;
          break;
        case Direction.LeftBottom:
          newPosition[0] -= speed * 0.7;
          newPosition[1] -= speed * 0.7;
          setDirection("left");
          moving = true;
          break;
      }
    }

    // Constrain the player within the game area boundaries
    newPosition[0] = Math.max(-halfWidth, Math.min(halfWidth, newPosition[0]));
    newPosition[1] = Math.max(
      -halfHeight,
      Math.min(halfHeight, newPosition[1])
    );

    setIsMoving(moving);

    if (newPosition[0] !== position[0] || newPosition[1] !== position[1]) {
      setPosition(newPosition);
    }
  });

  return { position, direction, isMoving };
}

export default useWASDControls;
