import { Point2d, Vector2, clamp, lerp } from '@krutoo/utils';
import { Demo, DemoContext, DemoInitContext, DemoRenderContext } from './types.ts';
import { easeInQuad } from './utils.ts';

interface Thing extends Point2d {
  readonly radius: number;
}

export class DemoDots implements Demo {
  dots: Vector2[];
  thing: Thing;

  constructor({ canvas }: DemoInitContext) {
    this.dots = [];
    this.thing = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      get radius() {
        return Math.min(canvas.width, canvas.height) / 2;
      },
    };

    const radius = clamp(Math.min(canvas.width, canvas.height) / 48, 12, 64);
    const hexWidth = Math.sqrt(3) * radius;
    const hexHeight = 2 * radius;
    const xSpacing = hexWidth;
    const ySpacing = (3 / 4) * hexHeight;
    const columns = canvas.width / xSpacing;
    const rows = canvas.height / ySpacing + 1;

    for (let r = 0; r < rows; r++) {
      const xOffset = r % 2 === 0 ? 0 : xSpacing / 2;

      for (let c = 0; c < columns; c++) {
        const x = c * xSpacing + xOffset;
        const y = r * ySpacing;

        this.dots.push(Vector2.of(x, y));
      }
    }
  }

  update({ mouse }: DemoContext) {
    const { thing } = this;

    thing.x = lerp(thing.x, mouse.x, 0.08);
    thing.y = lerp(thing.y, mouse.y, 0.08);
  }

  render({ context, colorScheme }: DemoRenderContext) {
    const { dots, thing } = this;

    context.fillStyle = colorScheme === 'dark' ? '#ffffffaa' : '#3c3c43aa';
    context.beginPath();

    for (let i = 0; i < dots.length; i++) {
      const dot = dots[i]!;
      const distance = dot.getDistance(thing);

      if (distance > thing.radius) {
        continue;
      }

      const dotRadius = lerp(0, 3, easeInQuad(1 - distance / thing.radius));

      context.moveTo(dot.x + dotRadius, dot.y);
      context.arc(dot.x, dot.y, dotRadius, 0, 2 * Math.PI);
    }

    context.fill();
  }
}
