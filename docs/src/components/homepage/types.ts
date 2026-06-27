import { ColorSchemesContextValue } from '@krutoo/showcase/runtime-showcase';
import { Point2d } from '@krutoo/utils';

export interface DemoInitContext {
  colorScheme: ColorSchemesContextValue['colorScheme'];
  canvas: HTMLCanvasElement;
}

export interface DemoContext extends DemoInitContext {
  mouse: Point2d;
}

export interface DemoRenderContext extends DemoContext {
  context: CanvasRenderingContext2D;
}

export interface Demo {
  update(ctx: DemoContext): void;
  render(ctx: DemoRenderContext): void;
}
