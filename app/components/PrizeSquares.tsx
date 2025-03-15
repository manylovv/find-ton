import { useMemo, useEffect } from "react";
import * as THREE from "three";
import { ReactNode } from "react";

interface PrizeSquare {
  x: number;
  y: number;
  progress: number;
}

interface PrizeSquaresProps {
  gridSize: number;
  onPrizesGenerated?: (prizes: PrizeSquare[]) => void;
  prizes?: PrizeSquare[]; // Add this prop to receive updated prizes from parent
}

// version of prize squares that are not far from each other (simplify version)
const PrizeSquares = ({
  gridSize,
  onPrizesGenerated,
  prizes: externalPrizes,
}: PrizeSquaresProps) => {
  // Calculate the size of each tile in world units
  const worldTileSize = gridSize / 10;

  // Calculate how many tiles we need to cover the grid
  const tilesNeeded = Math.ceil(gridSize / worldTileSize);

  // Define the playable area boundaries (inside the border)
  const maxCoord = tilesNeeded / 2 - 2; // Stay 2 tiles away from the border
  const minCoord = -maxCoord;

  // Generate 3 random prize squares if not provided externally
  const generatedPrizes = useMemo(() => {
    // If prizes are provided externally, don't generate new ones
    if (externalPrizes && externalPrizes.length > 0) {
      return [];
    }

    const newPrizes: PrizeSquare[] = [];

    // Define minimum distance between prizes (in grid units)
    const minDistance = Math.floor(tilesNeeded / 6); // About 1/6 of the playable area width
    console.log(`Minimum distance between prizes: ${minDistance} tiles`);

    // Helper function to calculate distance between two points
    const calculateDistance = (
      x1: number,
      y1: number,
      x2: number,
      y2: number
    ) => {
      return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    };

    // Helper function to check if a position is far enough from existing prizes
    const isFarEnough = (x: number, y: number) => {
      for (const prize of newPrizes) {
        const distance = calculateDistance(x, y, prize.x, prize.y);
        if (distance < minDistance) {
          return false;
        }
      }
      return true;
    };

    // Create 3 prize squares with random positions
    for (let i = 0; i < 3; i++) {
      // Try to find a suitable position (with maximum attempts to prevent infinite loops)
      let attempts = 0;
      let randomX, randomY;
      let foundPosition = false;

      while (!foundPosition && attempts < 100) {
        // Generate random coordinates within the playable area
        randomX =
          Math.floor(Math.random() * (maxCoord - minCoord + 1)) + minCoord;
        randomY =
          Math.floor(Math.random() * (maxCoord - minCoord + 1)) + minCoord;

        // Check if this position is far enough from existing prizes
        if (isFarEnough(randomX, randomY)) {
          foundPosition = true;
        }

        attempts++;
      }

      // If we couldn't find a position after max attempts, use the last generated one
      if (!foundPosition) {
        console.warn(
          `Couldn't find an ideal position for prize ${i + 1} after ${attempts} attempts`
        );
      }

      // Add to our prize squares array with initial progress of 0
      newPrizes.push({ x: randomX!, y: randomY!, progress: 0 });

      // Log the prize positions for debugging
      console.log(`Prize ${i + 1} placed at (${randomX}, ${randomY})`);
    }

    // Call the callback with the generated prizes
    if (onPrizesGenerated) {
      onPrizesGenerated(newPrizes);
    }

    return newPrizes;
  }, [
    gridSize,
    maxCoord,
    minCoord,
    tilesNeeded,
    onPrizesGenerated,
    externalPrizes,
  ]);

  // Use either the external prizes or the generated ones
  const prizesToRender =
    externalPrizes && externalPrizes.length > 0
      ? externalPrizes
      : generatedPrizes;

  // Effect to log prize progress changes
  useEffect(() => {
    if (prizesToRender.length > 0) {
      console.log(
        "Prize progress values:",
        prizesToRender.map((p) => p.progress)
      );
    }
  }, [prizesToRender]);

  // Render the prize squares
  const prizeElements = useMemo(() => {
    const elements: ReactNode[] = [];

    prizesToRender.forEach((prize, index) => {
      // Skip rendering fully mined prizes (progress = 100)
      if (prize.progress >= 100) {
        console.log(
          `Prize ${index} is fully mined (${prize.progress}%), not rendering`
        );
        return;
      }

      // Calculate opacity based on progress (more progress = more solid)
      const opacity = 0.3 + (prize.progress / 100) * 0.7;

      // Determine color based on progress
      let color;
      if (prize.progress >= 75) {
        color = 0x00ff00; // Green when almost mined (75-100%)
      } else if (prize.progress >= 50) {
        color = 0xffff00; // Yellow when half mined (50-75%)
      } else if (prize.progress >= 25) {
        color = 0xff8800; // Orange when partially mined (25-50%)
      } else {
        color = 0xff0000; // Red when barely mined (0-25%)
      }

      console.log(
        `Rendering prize ${index} with progress ${prize.progress}% and color ${color.toString(16)}`
      );

      // Create a material for the prize square with appropriate color
      const material = new THREE.SpriteMaterial({
        color: color,
        opacity: opacity,
        transparent: true,
      });

      // Create the prize square sprite
      elements.push(
        <sprite
          key={`prize-${index}-${prize.progress}`} // Add progress to key to force re-render
          position={[prize.x * worldTileSize, prize.y * worldTileSize, 0.1]} // Slightly above the tiles
          scale={[worldTileSize, worldTileSize, 1]}>
          <primitive object={material} />
        </sprite>
      );
    });

    return elements;
  }, [prizesToRender, worldTileSize]); // Make sure to include prizesToRender in dependencies

  return <>{prizeElements}</>;
};

export default PrizeSquares;
export type { PrizeSquare };
