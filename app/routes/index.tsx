import { createFileRoute, useRouter } from '@tanstack/react-router';

import { Application, extend } from '@pixi/react';
import { Container, Graphics, Sprite } from 'pixi.js';

import { BunnySprite } from '../components/BunnySprite';

// extend tells @pixi/react what Pixi.js components are available
extend({
  Container,
  Graphics,
  Sprite,
});

export const Route = createFileRoute('/')({
  ssr: false,
  component: Home,
});

function Home() {
  return (
    <Application>
      <BunnySprite />
    </Application>
  );
}
