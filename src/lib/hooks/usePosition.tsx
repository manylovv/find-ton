import { useEffect, useRef } from "react";

export function usePosition(
  position: [number, number, number],
  onPositionUpdate?: (position: [number, number, number]) => void,
) {
  const positionRef = useRef<[number, number, number]>(position);

  useEffect(() => {
    positionRef.current = position;

    if (onPositionUpdate) {
      onPositionUpdate(position);
    }
  }, [position, onPositionUpdate]);

  return { positionRef };
}
