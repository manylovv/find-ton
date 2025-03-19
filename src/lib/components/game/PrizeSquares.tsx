import { useEffect } from "react";
import { useGeneratePrizes } from "~/lib/hooks/useGeneratePrizes";
import { useRenderPrizes } from "~/lib/hooks/useRenderPrizes";

interface PrizeSquare {
  x: number;
  y: number;
  progress: number;
  amount: number;
}

interface PrizeSquaresProps {
  gridSize: number;
  onPrizesGenerated?: (prizes: PrizeSquare[]) => void;
  prizes?: PrizeSquare[];
}

const PrizeSquares = ({
  gridSize,
  onPrizesGenerated,
  prizes: externalPrizes,
}: PrizeSquaresProps) => {
  const worldTileSize = gridSize / 10;

  const { prizesToRender } = useGeneratePrizes({
    gridSize,
    externalPrizes,
    onPrizesGenerated,
  });

  const prizeElements = useRenderPrizes({ prizesToRender, worldTileSize });

  return <>{prizeElements}</>;
};

export default PrizeSquares;
export type { PrizeSquare };
