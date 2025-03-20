import { ReactNode, useMemo } from "react";
import * as THREE from "three";
import { TileData } from "../../types/tileData";

interface UseTiledGridProps {
  tilesetTexture: THREE.Texture | null;
  gridSize: number;
  mapData?: { tiles: TileData[] };
}

export function useTiledGrid({
  tilesetTexture,
  gridSize,
  mapData,
}: UseTiledGridProps): ReactNode[] | null {
  return useMemo(() => {
    if (!tilesetTexture) return null;

    tilesetTexture.magFilter = THREE.NearestFilter;
    tilesetTexture.minFilter = THREE.NearestFilter;

    const tileSize = 16;
    const tilesPerRow = tilesetTexture.image.width / tileSize;
    const tilesPerColumn = tilesetTexture.image.height / tileSize;
    const tiles: ReactNode[] = [];
    const worldTileSize = gridSize / 10;
    const tilesNeeded = Math.ceil(gridSize / worldTileSize);

    if (mapData && mapData.tiles.length > 0) {
      console.log("Using map data from provided source");

      mapData.tiles.forEach((tile) => {
        const u1 = (tile.tileX * tileSize) / tilesetTexture.image.width;
        const v1 = (tile.tileY * tileSize) / tilesetTexture.image.height;
        const u2 = ((tile.tileX + 1) * tileSize) / tilesetTexture.image.width;
        const v2 = ((tile.tileY + 1) * tileSize) / tilesetTexture.image.height;

        const tileTexture = tilesetTexture.clone();
        tileTexture.repeat.set(u2 - u1, v2 - v1);
        tileTexture.offset.set(u1, v1);

        tiles.push(
          <sprite
            key={`${tile.x}-${tile.y}`}
            position={[tile.x * worldTileSize, tile.y * worldTileSize, 0]}
            scale={[worldTileSize, worldTileSize, 1]}
          >
            <spriteMaterial map={tileTexture} />
          </sprite>,
        );
      });
    } else {
      console.log("No map data found. Generating new map...");

      const generatedTiles: TileData[] = [];

      for (let x = -tilesNeeded / 2; x < tilesNeeded / 2; x++) {
        for (let y = -tilesNeeded / 2; y < tilesNeeded / 2; y++) {
          const randomTileX = Math.floor(Math.random() * tilesPerRow);
          const randomTileY = Math.floor(Math.random() * tilesPerColumn);

          generatedTiles.push({
            x,
            y,
            tileX: randomTileX,
            tileY: randomTileY,
          });

          const u1 = (randomTileX * tileSize) / tilesetTexture.image.width;
          const v1 = (randomTileY * tileSize) / tilesetTexture.image.height;
          const u2 = ((randomTileX + 1) * tileSize) / tilesetTexture.image.width;
          const v2 = ((randomTileY + 1) * tileSize) / tilesetTexture.image.height;

          const tileTexture = tilesetTexture.clone();
          tileTexture.repeat.set(u2 - u1, v2 - v1);
          tileTexture.offset.set(u1, v1);

          tiles.push(
            <sprite
              key={`${x}-${y}`}
              position={[x * worldTileSize, y * worldTileSize, 0]}
              scale={[worldTileSize, worldTileSize, 1]}
            >
              <spriteMaterial map={tileTexture} />
            </sprite>,
          );
        }
      }

      console.log("Generated new map data:");
      console.log(
        JSON.stringify({ tiles: generatedTiles, timestamp: Date.now() }, null, 2),
      );
    }

    return tiles;
  }, [tilesetTexture, gridSize, mapData]);
}
