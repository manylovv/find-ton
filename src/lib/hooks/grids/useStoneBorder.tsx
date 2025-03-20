import { ReactNode, useMemo } from "react";
import * as THREE from "three";

interface UseStoneBorderProps {
  tilesetTexture: THREE.Texture | null;
  gridSize: number;
  stoneTileX?: number;
  stoneTileY?: number;
  borderWidth?: number;
}

export function useStoneBorder({
  tilesetTexture,
  gridSize,
  stoneTileX = 9,
  stoneTileY = 0,
  borderWidth = 1,
}: UseStoneBorderProps): ReactNode[] | null {
  return useMemo(() => {
    if (!tilesetTexture) return null;

    const tiles: ReactNode[] = [];
    const tileSize = 16;
    const worldTileSize = gridSize / 10;

    // Calculate UV coordinates for the stone tile
    const u1 = (stoneTileX * tileSize) / tilesetTexture.image.width;
    const v1 = (stoneTileY * tileSize) / tilesetTexture.image.height;
    const u2 = ((stoneTileX + 1) * tileSize) / tilesetTexture.image.width;
    const v2 = ((stoneTileY + 1) * tileSize) / tilesetTexture.image.height;

    // Calculate how many tiles we need to cover the grid
    const tilesNeeded = Math.ceil(gridSize / worldTileSize);

    // Calculate exact positions for borders to ensure symmetry
    const innerEdge = tilesNeeded / 2;
    const outerEdge = innerEdge + borderWidth;

    // Create the border tiles with precise positioning
    // Top and bottom borders
    for (let i = -outerEdge; i < outerEdge; i++) {
      // Top border
      for (let j = 0; j < borderWidth; j++) {
        const tileTexture = tilesetTexture.clone();
        tileTexture.repeat.set(u2 - u1, v2 - v1);
        tileTexture.offset.set(u1, v1);

        tiles.push(
          <sprite
            key={`top-${i}-${j}`}
            position={[i * worldTileSize, (innerEdge + j) * worldTileSize, 0]}
            scale={[worldTileSize, worldTileSize, 1]}
          >
            <spriteMaterial map={tileTexture} />
          </sprite>,
        );
      }

      // Bottom border
      for (let j = 0; j < borderWidth; j++) {
        const tileTexture = tilesetTexture.clone();
        tileTexture.repeat.set(u2 - u1, v2 - v1);
        tileTexture.offset.set(u1, v1);

        tiles.push(
          <sprite
            key={`bottom-${i}-${j}`}
            position={[i * worldTileSize, (-innerEdge - j - 1) * worldTileSize, 0]}
            scale={[worldTileSize, worldTileSize, 1]}
          >
            <spriteMaterial map={tileTexture} />
          </sprite>,
        );
      }
    }

    // Left and right borders (excluding corners which are already covered)
    for (let j = -innerEdge; j < innerEdge; j++) {
      // Left border
      for (let i = 0; i < borderWidth; i++) {
        const tileTexture = tilesetTexture.clone();
        tileTexture.repeat.set(u2 - u1, v2 - v1);
        tileTexture.offset.set(u1, v1);

        tiles.push(
          <sprite
            key={`left-${i}-${j}`}
            position={[(-innerEdge - i - 1) * worldTileSize, j * worldTileSize, 0]}
            scale={[worldTileSize, worldTileSize, 1]}
          >
            <spriteMaterial map={tileTexture} />
          </sprite>,
        );
      }

      // Right border
      for (let i = 0; i < borderWidth; i++) {
        const tileTexture = tilesetTexture.clone();
        tileTexture.repeat.set(u2 - u1, v2 - v1);
        tileTexture.offset.set(u1, v1);

        tiles.push(
          <sprite
            key={`right-${i}-${j}`}
            position={[(innerEdge + i) * worldTileSize, j * worldTileSize, 0]}
            scale={[worldTileSize, worldTileSize, 1]}
          >
            <spriteMaterial map={tileTexture} />
          </sprite>,
        );
      }
    }

    return tiles;
  }, [tilesetTexture, gridSize, stoneTileX, stoneTileY, borderWidth]);
}
