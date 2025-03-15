import { useMemo, useEffect } from "react";
import * as THREE from "three";
import { ReactNode } from "react";

interface PrizeSquare {
  x: number;
  y: number;
}

interface PrizeSquaresProps {
  gridSize: number;
  onPrizesGenerated?: (prizes: PrizeSquare[]) => void;
}

// version of prize squares that are not far from each other (simplify version)
const PrizeSquares = ({ gridSize, onPrizesGenerated }: PrizeSquaresProps) => {
  const prizeSquares = useMemo(() => {
    // Calculate the size of each tile in world units
    const worldTileSize = gridSize / 50;

    // Calculate how many tiles we need to cover the grid
    const tilesNeeded = Math.ceil(gridSize / worldTileSize);

    // Define the playable area boundaries (inside the border)
    const maxCoord = tilesNeeded / 2 - 2; // Stay 2 tiles away from the border
    const minCoord = -maxCoord;

    // Generate 3 random prize squares
    const prizes: PrizeSquare[] = [];
    const prizeElements: ReactNode[] = [];

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
      for (const prize of prizes) {
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

      // Add to our prize squares array
      prizes.push({ x: randomX!, y: randomY! });

      // Create a red material for the prize square
      const redMaterial = new THREE.SpriteMaterial({
        color: 0xff0000, // Red color
        opacity: 0.7, // Semi-transparent
        transparent: true,
      });

      // Create the prize square sprite
      prizeElements.push(
        <sprite
          key={`prize-${i}`}
          position={[randomX! * worldTileSize, randomY! * worldTileSize, 0.1]} // Slightly above the tiles
          scale={[worldTileSize, worldTileSize, 1]}>
          <primitive object={redMaterial} />
        </sprite>
      );

      // Log the prize positions for debugging
      console.log(`Prize ${i + 1} placed at (${randomX}, ${randomY})`);
    }

    // Call the callback with the generated prizes
    if (onPrizesGenerated) {
      onPrizesGenerated(prizes);
    }

    return prizeElements;
  }, [gridSize, onPrizesGenerated]);

  return <>{prizeSquares}</>;
};

// version of prize squares that are far from each other

// const prizeSquares = useMemo(
//   (gridSize: number) => {
//     // Calculate the size of each tile in world units
//     const worldTileSize = gridSize / 50;

//     // Calculate how many tiles we need to cover the grid
//     const tilesNeeded = Math.ceil(gridSize / worldTileSize);

//     // Define the playable area boundaries (inside the border)
//     const maxCoord = tilesNeeded / 2 - 2; // Stay 2 tiles away from the border
//     const minCoord = -maxCoord;

//     // Generate 3 random prize squares
//     const prizes: PrizeSquare[] = [];
//     const prizeElements: ReactNode[] = [];

//     // Define minimum distance between prizes (in grid units)
//     const minDistance = Math.floor(tilesNeeded / 6); // About 1/6 of the playable area width
//     console.log(`Minimum distance between prizes: ${minDistance} tiles`);

//     // Helper function to calculate distance between two points
//     const calculateDistance = (
//       x1: number,
//       y1: number,
//       x2: number,
//       y2: number
//     ) => {
//       return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
//     };

//     // Helper function to check if a position is far enough from existing prizes
//     const isFarEnough = (x: number, y: number) => {
//       for (const prize of prizes) {
//         const distance = calculateDistance(x, y, prize.x, prize.y);
//         if (distance < minDistance) {
//           return false;
//         }
//       }
//       return true;
//     };

//     // Create 3 prize squares with random positions
//     for (let i = 0; i < 5; i++) {
//       // Try to find a suitable position (with maximum attempts to prevent infinite loops)
//       let attempts = 0;
//       let randomX, randomY;
//       let foundPosition = false;

//       while (!foundPosition && attempts < 100) {
//         // Generate random coordinates within the playable area
//         randomX =
//           Math.floor(Math.random() * (maxCoord - minCoord + 1)) + minCoord;
//         randomY =
//           Math.floor(Math.random() * (maxCoord - minCoord + 1)) + minCoord;

//         // Check if this position is far enough from existing prizes
//         if (isFarEnough(randomX, randomY)) {
//           foundPosition = true;
//         }

//         attempts++;
//       }

//       // If we couldn't find a position after max attempts, use the last generated one
//       if (!foundPosition) {
//         console.warn(
//           `Couldn't find an ideal position for prize ${i + 1} after ${attempts} attempts`
//         );
//       }

//       // Add to our prize squares array
//       prizes.push({ x: randomX!, y: randomY! });

//       // Create a red material for the prize square
//       const redMaterial = new THREE.SpriteMaterial({
//         color: 0xff0000, // Red color
//         opacity: 0.7, // Semi-transparent
//         transparent: true,
//       });

//       // Create the prize square sprite
//       prizeElements.push(
//         <sprite
//           key={`prize-${i}`}
//           position={[randomX! * worldTileSize, randomY! * worldTileSize, 0.1]} // Slightly above the tiles
//           scale={[worldTileSize, worldTileSize, 1]}>
//           <primitive object={redMaterial} />
//         </sprite>
//       );

//       // Log the prize positions for debugging
//       console.log(`Prize ${i + 1} placed at (${randomX}, ${randomY})`);
//     }

//     return prizeElements;
//   },
//   [gridSize]
// );

export default PrizeSquares;
export type { PrizeSquare };
