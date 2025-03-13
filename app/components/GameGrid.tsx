function GameGrid() {
  // Make the grid smaller - 100x100 for better phone display fit
  const gridSize = 100;

  return (
    <group position={[0, 0, -1]}>
      <sprite scale={[gridSize + 2, gridSize + 2, 1]}>
        <spriteMaterial color="#444444" transparent opacity={0.8} />
      </sprite>
      <sprite scale={[gridSize, gridSize, 1]}>
        <spriteMaterial color="#a3d9ff" transparent opacity={0.5} />
      </sprite>
    </group>
  );
}

export default GameGrid;
