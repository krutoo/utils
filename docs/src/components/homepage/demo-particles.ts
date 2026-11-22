import { Point2d, lerp, randomInteger } from '@krutoo/utils';
import { Demo, DemoContext } from './types.ts';

const MOUSE_RADIUS = 300;
const AREA_PER_PARTICLE = 120;
const MAX_PARTICLES = 5000;
const MAX_FRAME_TIME = 1000 / 120;

interface Camera3d {
  depth: number;
  width: number;
  height: number;
}

interface World3d {
  vertices: Vector3d[];
  lines: Line3d[];
  rotation: Vector3d;
}

interface Vector3d {
  x: number;
  y: number;
  z: number;
}

interface Line3d {
  a: Vector3d;
  b: Vector3d;
}

interface Line2d {
  a: Point2d;
  b: Point2d;
}

export interface DemoParticlesControls {
  follow: boolean;
}

export class DemoParticles implements Demo {
  controls: DemoParticlesControls;

  protected particles: Particle[];
  protected shift: number;
  protected target: Point2d;
  protected renderer: Renderer3d;
  protected context?: DemoContext & { shape: Line2d[]; controls: DemoParticlesControls };

  constructor(ctx: DemoContext) {
    this.controls = {
      follow: false,
    };
    this.renderer = new Renderer3d(ctx);
    this.particles = [];
    this.shift = 0;
    this.target = { x: ctx.canvas.width / 2, y: ctx.canvas.height / 2 };

    const area = ctx.canvas.width * ctx.canvas.height;
    const targetCount = Math.floor(area / AREA_PER_PARTICLE);
    const finalCount = Math.min(targetCount, MAX_PARTICLES);

    for (let i = 0; i < finalCount; i++) {
      this.particles.push(new Particle(ctx));
    }
  }

  update(ctx: DemoContext): void {
    // smooth move to mouse
    this.target.x = lerp(this.target.x, ctx.mouse.x, 0.1);
    this.target.y = lerp(this.target.y, ctx.mouse.y, 0.1);

    // rotate 3d world
    this.renderer.world.rotation.y += 0.01;
  }

  render(ctx: DemoContext): void {
    const shape = this.renderer.render(ctx);

    if (!this.context) {
      this.context = { ...ctx, shape, controls: this.controls };
      this.context.mouse = this.target;
    }
    this.context.shape = shape;

    const startTime = performance.now();
    const start = this.shift;
    const end = this.particles.length;
    let interrupted = false;

    for (let i = start; i < end; i++) {
      this.particles[i]!.update(this.context);
      this.particles[i]!.render(this.context);

      if (i % 10 === 0) {
        if (performance.now() - startTime > MAX_FRAME_TIME) {
          this.shift = (start + i) % end;
          interrupted = true;
          break;
        }
      }
    }

    if (!interrupted) {
      this.shift = 0;
    }
  }
}

class Renderer3d {
  world: World3d;
  camera: Camera3d;

  constructor(ctx: DemoContext) {
    const vertices: Vector3d[] = [
      // cube
      { x: 100, y: 100, z: 500 },
      { x: -100, y: 100, z: 500 },
      { x: -100, y: -100, z: 500 },
      { x: 100, y: -100, z: 500 },

      { x: 100, y: 100, z: 300 },
      { x: -100, y: 100, z: 300 },
      { x: -100, y: -100, z: 300 },
      { x: 100, y: -100, z: 300 },
    ];

    this.world = {
      rotation: { x: 0, y: 0, z: 0 },
      lines: [
        // cube
        { a: vertices[0]!, b: vertices[1]! },
        { a: vertices[1]!, b: vertices[2]! },
        { a: vertices[2]!, b: vertices[3]! },
        { a: vertices[3]!, b: vertices[0]! },

        { a: vertices[4]!, b: vertices[5]! },
        { a: vertices[5]!, b: vertices[6]! },
        { a: vertices[6]!, b: vertices[7]! },
        { a: vertices[7]!, b: vertices[4]! },

        { a: vertices[0]!, b: vertices[4]! },
        { a: vertices[1]!, b: vertices[5]! },
        { a: vertices[2]!, b: vertices[6]! },
        { a: vertices[3]!, b: vertices[7]! },
      ],
      vertices,
    };

    this.camera = {
      depth: 600,
      width: ctx.canvas.width,
      height: ctx.canvas.height,
    };
  }

  render(ctx: DemoContext): Line2d[] {
    const display: Line2d[] = [];
    const { camera, world } = this;
    const cos = Math.cos(world.rotation.y);
    const sin = Math.sin(world.rotation.y);
    const centerZ = 400;

    for (let i = 0; i < world.lines.length; i++) {
      const line = world.lines[i]!;
      const vertices = [line.a, line.b];
      let a: Point2d | undefined;
      let b: Point2d | undefined;

      for (let j = 0; j < vertices.length; j++) {
        const vertex = vertices[j]!;
        const localZ = vertex.z - centerZ;
        const rotatedX = vertex.x * cos + localZ * sin;
        const rotatedY = vertex.y;
        const rotatedZ = -vertex.x * sin + localZ * cos;
        const finalZ = rotatedZ + centerZ;
        const scale = camera.depth / finalZ;
        const posX = scale * rotatedX + ctx.canvas.width / 2;
        const posY = scale * rotatedY + ctx.canvas.height / 2;

        if (j === 0) {
          a = { x: posX, y: posY };
        } else {
          b = { x: posX, y: posY };
        }
      }

      if (a && b) {
        display.push({ a, b });
      }
    }

    return display;
  }
}

class Particle {
  x: number;
  y: number;

  private homeX: number;
  private homeY: number;

  private randomX: number;
  private randomY: number;

  private targetX: number;
  private targetY: number;

  private opacity: number;
  private targetOpacity: number;

  private followIndex: number;
  private followFactor: number;

  constructor({ canvas }: DemoContext) {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;

    this.opacity = Math.random();
    this.targetOpacity = Math.random() > 0.5 ? 1 : 0;

    this.followIndex = -1;
    this.followFactor = Math.random();

    this.homeX = this.x;
    this.homeY = this.y;

    this.targetX = this.x;
    this.targetY = this.y;

    this.randomX = 0;
    this.randomY = 0;
  }

  update(ctx: DemoContext & { shape: Line2d[]; controls: DemoParticlesControls }) {
    if (ctx.controls.follow) {
      this.followToShape(ctx);
    } else {
      this.moveChaotic(ctx);
    }

    this.avoidMouse(ctx);
    this.blink();

    this.x = lerp(this.x, this.targetX, 0.05);
    this.y = lerp(this.y, this.targetY, 0.05);
  }

  private followToShape({ canvas, shape }: DemoContext & { shape: Line2d[] }) {
    if (this.followIndex === -1) {
      this.followIndex = randomInteger(0, shape.length - 1);
    }

    const { a, b } = shape[this.followIndex]!;
    let randomX = lerp(a.x, b.x, this.followFactor);
    let randomY = lerp(a.y, b.y, this.followFactor);

    this.homeX = randomX;
    this.homeY = randomY;

    if (this.homeX < 0 || this.homeX > canvas.width) {
      randomX *= -1;
    }
    if (this.homeY < 0 || this.homeY > canvas.height) {
      randomY *= -1;
    }

    this.targetX = this.homeX;
    this.targetY = this.homeY;
  }

  private moveChaotic({ canvas }: DemoContext) {
    this.randomX += (Math.random() - 0.5) * 0.5;
    this.randomY += (Math.random() - 0.5) * 0.5;

    this.randomX = Math.max(-1, Math.min(1, this.randomX));
    this.randomY = Math.max(-1, Math.min(1, this.randomY));

    this.homeX += this.randomX;
    this.homeY += this.randomY;

    if (this.homeX < 0 || this.homeX > canvas.width) {
      this.randomX *= -1;
    }
    if (this.homeY < 0 || this.homeY > canvas.height) {
      this.randomY *= -1;
    }

    this.targetX = this.homeX;
    this.targetY = this.homeY;
  }

  private avoidMouse({ mouse }: DemoContext) {
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < MOUSE_RADIUS) {
      const force = (MOUSE_RADIUS - distance) / MOUSE_RADIUS;
      const angle = Math.atan2(dy, dx);

      this.targetX += Math.cos(angle) * force * MOUSE_RADIUS;
      this.targetY += Math.sin(angle) * force * MOUSE_RADIUS;
    }
  }

  private blink() {
    this.opacity = lerp(this.opacity, this.targetOpacity, 0.05);

    if (Math.abs(this.opacity - this.targetOpacity) < 0.01) {
      this.targetOpacity = this.targetOpacity === 0 ? 1 : 0;
    }
  }

  render({ context, colorScheme }: DemoContext) {
    const globalAlpha = context.globalAlpha;

    context.fillStyle = colorScheme === 'dark' ? '#ffffffaa' : '#3c3c43aa';
    context.globalAlpha = this.opacity;
    context.beginPath();
    context.arc(this.x, this.y, 1.25, 0, Math.PI * 2);
    context.fill();
    context.globalAlpha = globalAlpha;
  }
}
