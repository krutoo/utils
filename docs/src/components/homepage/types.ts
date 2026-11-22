import { ColorSchemesContextValue } from '@krutoo/showcase/runtime-showcase';
import { Point2d } from '@krutoo/utils';

export interface DemoContext {
  colorScheme: ColorSchemesContextValue['colorScheme'];
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  mouse: Point2d;
}

export interface Demo {
  update(ctx: DemoContext): void;
  render(ctx: DemoContext): void;
}
