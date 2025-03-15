import { useTexture } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import { ReactNode } from "react";
import { mapCoordinates } from "../mapCoordinates";
import PrizeSquares, { PrizeSquare } from "./PrizeSquares";

// Interface for tile data to be stored
interface TileData {
  x: number;
  y: number;
  tileX: number;
  tileY: number;
}

interface GameGridProps {
  onPrizesGenerated?: (prizes: PrizeSquare[]) => void;
}

function GameGrid({ onPrizesGenerated }: GameGridProps) {
  // Make the grid smaller - 100x100 for better phone display fit
  const gridSize = 100;

  // Load the tileset texture
  const tilesetTexture = useTexture("/assets/TX Tileset Grass (1).png");

  // Create a grid of tiles using the tileset
  const tiledGrid = useMemo(() => {
    if (!tilesetTexture) return null;

    // Set texture filtering to nearest for pixel-perfect rendering
    tilesetTexture.magFilter = THREE.NearestFilter;
    tilesetTexture.minFilter = THREE.NearestFilter;

    // The tileset is 16x16 pixels per tile
    const tileSize = 16;

    // Calculate how many tiles are in the tileset (assuming it's a square)
    const tilesPerRow = tilesetTexture.image.width / tileSize;
    const tilesPerColumn = tilesetTexture.image.height / tileSize;

    // Create an array to hold all our tile sprites
    const tiles: ReactNode[] = [];

    // Calculate the size of each tile in world units - make it much smaller
    const worldTileSize = gridSize / 50; // Reduced from 10 to 50 for much smaller tiles

    // Calculate how many tiles we need to cover the grid
    const tilesNeeded = Math.ceil(gridSize / worldTileSize);

    // If we have map data in the file, use it
    if (mapCoordinates[0].tiles.length > 0) {
      console.log("Using map data from file");
      // Use the saved tile data to recreate the map
      mapCoordinates[0].tiles.forEach((tile) => {
        // Calculate UV coordinates for the saved tile
        const u1 = (tile.tileX * tileSize) / tilesetTexture.image.width;
        const v1 = (tile.tileY * tileSize) / tilesetTexture.image.height;
        const u2 = ((tile.tileX + 1) * tileSize) / tilesetTexture.image.width;
        const v2 = ((tile.tileY + 1) * tileSize) / tilesetTexture.image.height;

        // Clone the texture and set the UV mapping for this specific tile
        const tileTexture = tilesetTexture.clone();
        tileTexture.repeat.set(u2 - u1, v2 - v1);
        tileTexture.offset.set(u1, v1);

        // Create a sprite for this tile
        tiles.push(
          <sprite
            key={`${tile.x}-${tile.y}`}
            position={[tile.x * worldTileSize, tile.y * worldTileSize, 0]}
            scale={[worldTileSize, worldTileSize, 1]}>
            <spriteMaterial map={tileTexture} />
          </sprite>
        );
      });
    } else {
      // If no map data in file, generate a new one and log it to console
      console.log("No map data found in file. Generating new map...");

      // Create a temporary array to hold the generated tile data
      const generatedTiles: TileData[] = [];

      // Create a grid of tiles - make it symmetrical
      for (let x = -tilesNeeded / 2; x < tilesNeeded / 2; x++) {
        for (let y = -tilesNeeded / 2; y < tilesNeeded / 2; y++) {
          // Pick a random tile from the tileset
          const randomTileX = Math.floor(Math.random() * tilesPerRow);
          const randomTileY = Math.floor(Math.random() * tilesPerColumn);

          // Save the tile data
          generatedTiles.push({
            x,
            y,
            tileX: randomTileX,
            tileY: randomTileY,
          });

          // Calculate UV coordinates for the selected tile
          const u1 = (randomTileX * tileSize) / tilesetTexture.image.width;
          const v1 = (randomTileY * tileSize) / tilesetTexture.image.height;
          const u2 =
            ((randomTileX + 1) * tileSize) / tilesetTexture.image.width;
          const v2 =
            ((randomTileY + 1) * tileSize) / tilesetTexture.image.height;

          // Clone the texture and set the UV mapping for this specific tile
          const tileTexture = tilesetTexture.clone();
          tileTexture.repeat.set(u2 - u1, v2 - v1);
          tileTexture.offset.set(u1, v1);

          // Create a sprite for this tile
          tiles.push(
            <sprite
              key={`${x}-${y}`}
              position={[x * worldTileSize, y * worldTileSize, 0]}
              scale={[worldTileSize, worldTileSize, 1]}>
              <spriteMaterial map={tileTexture} />
            </sprite>
          );
        }
      }

      // Output the generated map data to console for copying into the file
      console.log("COPY THIS MAP DATA INTO THE MAP_DATA CONSTANT IN THE FILE:");
      console.log(
        JSON.stringify(
          { tiles: generatedTiles, timestamp: Date.now() },
          null,
          2
        )
      );
    }

    return tiles;
  }, [tilesetTexture, gridSize]);

  // Create stone border using tiles from the tileset
  const stoneBorder = useMemo(() => {
    if (!tilesetTexture) return null;

    const tiles: ReactNode[] = [];
    const tileSize = 16;
    const worldTileSize = gridSize / 50;

    // We'll use a specific stone tile from the tileset
    const stoneTileX = 9; // Stone tile position
    const stoneTileY = 0; // Stone tile position

    // Calculate UV coordinates for the stone tile
    const u1 = (stoneTileX * tileSize) / tilesetTexture.image.width;
    const v1 = (stoneTileY * tileSize) / tilesetTexture.image.height;
    const u2 = ((stoneTileX + 1) * tileSize) / tilesetTexture.image.width;
    const v2 = ((stoneTileY + 1) * tileSize) / tilesetTexture.image.height;

    // Calculate how many tiles we need to cover the grid
    const tilesNeeded = Math.ceil(gridSize / worldTileSize);

    // Ensure border width is consistent on all sides
    const borderWidth = 1;

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
            scale={[worldTileSize, worldTileSize, 1]}>
            <spriteMaterial map={tileTexture} />
          </sprite>
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
            position={[
              i * worldTileSize,
              (-innerEdge - j - 1) * worldTileSize,
              0,
            ]}
            scale={[worldTileSize, worldTileSize, 1]}>
            <spriteMaterial map={tileTexture} />
          </sprite>
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
            position={[
              (-innerEdge - i - 1) * worldTileSize,
              j * worldTileSize,
              0,
            ]}
            scale={[worldTileSize, worldTileSize, 1]}>
            <spriteMaterial map={tileTexture} />
          </sprite>
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
            scale={[worldTileSize, worldTileSize, 1]}>
            <spriteMaterial map={tileTexture} />
          </sprite>
        );
      }
    }

    return tiles;
  }, [tilesetTexture, gridSize]);

  return (
    <group position={[0, 0, -1]}>
      {/* Render the stone border */}
      {stoneBorder}

      {/* Render the tiled grid */}
      {tiledGrid}

      {/* Render the prize squares on top */}
      <PrizeSquares gridSize={gridSize} onPrizesGenerated={onPrizesGenerated} />
    </group>
  );
}

export default GameGrid;
