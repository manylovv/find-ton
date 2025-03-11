import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';

export const Route = createFileRoute('/')({
  ssr: false,
  component: Home,
});

function useWASDControls(speed = 0.1) {
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);
  const keysPressed = useRef<Record<string, boolean>>({});
  const [direction, setDirection] = useState<'down' | 'up' | 'left' | 'right'>(
    'down',
  );
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.key.toLowerCase()] = true;
    };

    const handleKeyUp = (e) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame(() => {
    const newPosition: [number, number, number] = [...position] as [
      number,
      number,
      number,
    ];

    let moving = false;

    if (keysPressed.current['w']) {
      newPosition[1] += speed;
      setDirection('up');
      moving = true;
    }
    if (keysPressed.current['s']) {
      newPosition[1] -= speed;
      setDirection('down');
      moving = true;
    }
    if (keysPressed.current['a']) {
      newPosition[0] -= speed;
      setDirection('left');
      moving = true;
    }
    if (keysPressed.current['d']) {
      newPosition[0] += speed;
      setDirection('right');
      moving = true;
    }

    setIsMoving(moving);

    if (newPosition[0] !== position[0] || newPosition[1] !== position[1]) {
      setPosition(newPosition);
    }
  });

  return { position, direction, isMoving };
}

function RetroSprite() {
  const texture = useTexture('/assets/Lavender_16x16RetroCharacter.png');
  const { position, direction, isMoving } = useWASDControls(0.2);
  const [frameIndex, setFrameIndex] = useState(0);
  const frameTimer = useRef(0);

  const frameRate = 8;
  const frameDuration = 1 / frameRate;

  useFrame((_, delta) => {
    if (isMoving) {
      frameTimer.current += delta;

      if (frameTimer.current >= frameDuration) {
        frameTimer.current = 0;
        setFrameIndex((prev) => (prev + 1) % 4);
      }
    } else {
      setFrameIndex(0);
    }
  });

  const spriteTexture = useMemo(() => {
    if (!texture) return null;

    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;

    const newTexture = texture.clone();

    const spriteWidth = 16;
    const spriteHeight = 16;
    const sheetWidth = 192;
    const sheetHeight = 160;
    const cols = sheetWidth / spriteWidth;
    const rows = sheetHeight / spriteHeight;

    let row, col;

    switch (direction) {
      case 'down':
        row = 0;
        col = frameIndex % 4;
        break;
      case 'up':
        row = 0;
        col = 4 + (frameIndex % 4);
        break;
      case 'left':
        row = 0;
        col = 8 + (frameIndex % 4);
        break;
      case 'right':
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

  if (!spriteTexture) return null;

  return (
    <sprite position={position} scale={[3, 3, 1]}>
      <spriteMaterial map={spriteTexture} transparent={true} alphaTest={0.1} />
    </sprite>
  );
}

function Home() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    setInitialized(true);

    return () => {
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.overflow = '';
    };
  }, []);

  if (!initialized) {
    return <div>Loading...</div>;
  }

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden">
      <Canvas
        camera={{
          position: [0, 0, 50],
          fov: 50,
          zoom: 1,
        }}
        style={{
          width: '100vw',
          height: '100vh',
        }}
      >
        <color attach="background" args={['#87CEEB']} />
        <ambientLight intensity={1} />
        <RetroSprite />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
