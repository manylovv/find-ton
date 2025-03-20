import { useMemo } from "react";
import * as THREE from "three";
import { cols, rows } from "../../constants/spriteConstants";

export const useSpriteTexture = (
  texture: THREE.Texture | null,
  direction: "down" | "up" | "left" | "right",
  frameIndex: number,
): THREE.Texture | null => {
  return useMemo(() => {
    if (!texture) return null;

    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;

    const newTexture = texture.clone();

    let row: number, col: number;
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
};
