import { useTexture } from "@react-three/drei";
import { mapCoordinates } from "~/lib/constants/mapCoordinates";
import { useStoneBorder } from "~/lib/hooks/useStoneBorder";
import { useTiledGrid } from "~/lib/hooks/useTiledGrid";
import PrizeSquares, { PrizeSquare } from "./PrizeSquares";

interface GameGridProps {
  onPrizesGenerated?: (prizes: PrizeSquare[]) => void;
  prizeLocations?: PrizeSquare[];
}

function GameGrid({ onPrizesGenerated, prizeLocations }: GameGridProps) {
  const gridSize = 20;

  const tilesetTexture = useTexture("/assets/TX Tileset Grass (1).png");

  const tiledGrid = useTiledGrid({
    tilesetTexture,
    gridSize,
    mapData: mapCoordinates[0],
  });

  const stoneBorder = useStoneBorder({
    tilesetTexture,
    gridSize,
  });

  return (
    <group position={[0, 0, -1]}>
      {stoneBorder}

      {tiledGrid}

      <PrizeSquares
        gridSize={gridSize}
        onPrizesGenerated={onPrizesGenerated}
        prizes={prizeLocations}
      />
    </group>
  );
}

export default GameGrid;
