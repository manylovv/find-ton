import { ReactNode, useMemo } from "react";
import * as THREE from "three";
import { PrizeSquare } from "~/lib/components/game/PrizeSquares";

interface UseRenderPrizesParams {
  prizesToRender: PrizeSquare[];
  worldTileSize: number;
}

export function useRenderPrizes({
  prizesToRender,
  worldTileSize,
}: UseRenderPrizesParams) {
  const prizeElements = useMemo(() => {
    const elements: ReactNode[] = [];

    prizesToRender.forEach((prize, index) => {
      if (prize.progress >= 100) {
        console.log(`Prize ${index} is fully mined (${prize.progress}%), not rendering`);
        return;
      }

      const opacity = 0.3 + (prize.progress / 100) * 0.7;

      let color;
      if (prize.progress >= 75) {
        color = 0x00ff00;
      } else if (prize.progress >= 50) {
        color = 0xffff00;
      } else if (prize.progress >= 25) {
        color = 0xff8800;
      } else {
        color = 0xff0000;
      }

      console.log(
        `Rendering prize ${index} with progress ${prize.progress}% and color ${color.toString(16)}`,
      );

      const material = new THREE.SpriteMaterial({
        color: color,
        opacity: opacity,
        transparent: true,
      });

      const progressBarBgMaterial = new THREE.SpriteMaterial({
        color: 0x000000,
        opacity: 0.5,
        transparent: true,
      });

      const progressBarFillMaterial = new THREE.SpriteMaterial({
        color: 0xff0000,
        opacity: 0.8,
        transparent: true,
      });

      elements.push(
        <sprite
          key={`prize-${index}-${prize.progress}`}
          position={[prize.x * worldTileSize, prize.y * worldTileSize, 0.1]}
          scale={[worldTileSize, worldTileSize, 1]}
        >
          <primitive object={material} />
        </sprite>,
      );

      if (prize.progress >= 5) {
        elements.push(
          <sprite
            key={`prize-bg-${index}-${prize.progress}`}
            position={[
              prize.x * worldTileSize,
              prize.y * worldTileSize + worldTileSize * 0.7,
              0.15,
            ]}
            scale={[worldTileSize * 1, worldTileSize * 0.15, 1]}
          >
            {" "}
            <primitive object={progressBarBgMaterial} />
          </sprite>,
        );

        if (prize.progress > 0) {
          elements.push(
            <sprite
              key={`prize-fill-${index}-${prize.progress}`}
              position={[
                prize.x * worldTileSize -
                  (worldTileSize * 1 * (1 - prize.progress / 100)) / 2,
                prize.y * worldTileSize + worldTileSize * 0.7,
                0.16,
              ]}
              scale={[
                worldTileSize * 1 * (prize.progress / 100),
                worldTileSize * 0.15,
                1,
              ]}
            >
              {" "}
              <primitive object={progressBarFillMaterial} />
            </sprite>,
          );
        }
      }
    });

    return elements;
  }, [prizesToRender, worldTileSize]);

  return prizeElements;
}
