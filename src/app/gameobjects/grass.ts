import { clamp, randomBetween, range } from "../../lib/math";
import { Rect } from "../../lib/rect";
import { Vec2 } from "../../lib/vec2";
import type { IUpdateable } from "../../lib/interfaces/updateable";

interface Grassinka {
  pos: Vec2;
  color: string;
  timeShift: number;
}

const GROW_SPEED = 0.1;
const COLLECT_SPEED = -5.5;
const MIN_GROW_VALUE = 0.7;

export class Grass implements IUpdateable {
  constructor(
    private ctx: CanvasRenderingContext2D,
    private pos: Vec2,
    private growValue = 0,
    private growSpeed: number = GROW_SPEED
  ) {}

  private body = new Rect(4, 4, 24, 24);
  private time = 0;

  private grassinkas: Array<Grassinka> = range(0, 12).map(() => ({
    // pos: new Vec2(randomBetween(0, 28), randomBetween(8, 30)),
    pos: new Vec2(randomBetween(-2, 26), randomBetween(2, 32)),
    color: `rgb(${randomBetween(30, 70)}, ${randomBetween(120, 220)}, 0)`,
    timeShift: randomBetween(0, 1.5),
  }));

  get isCollectable() {
    return this.growSpeed > 0 && this.growValue >= MIN_GROW_VALUE;
  }

  collect(): number {
    if (this.isCollectable) {
      const v = this.growValue;
      // this.growValue = 0;
      this.growSpeed = COLLECT_SPEED;
      return v;
    }

    return 0;
  }

  get bodyRect() {
    return new Rect(
      this.pos.x + this.body.x,
      this.pos.y + this.body.y,
      this.body.w,
      this.body.h
    );
  }

  _drawGrassinka(g: Grassinka) {
    this.ctx.save();
    this.ctx.translate(g.pos.x, g.pos.y);
    this.ctx.strokeStyle = g.color;
    this.ctx.lineWidth = 1 + 4 * this.growValue;
    const time = g.timeShift + this.time;

    const upperPoint = {
      x: (2 + 5 * Math.sin(2 * time)) * this.growValue,
      y: -16 * this.growValue + 0 * Math.sin(3 * time),
    };

    const drawSegment = (stX: number, stY: number) => {
      this.ctx.beginPath();
      this.ctx.moveTo(stX, stY);
      this.ctx.quadraticCurveTo(
        1 + 3 * this.growValue,
        -2 - 12 * this.growValue,
        upperPoint.x,
        upperPoint.y
      );
      this.ctx.stroke();
    };

    // drawSegment(0, 0);
    drawSegment(4, 0);

    this.ctx.restore();
  }

  update(dt: number) {
    this.time += dt;
    this.growValue = clamp(this.growValue + this.growSpeed * dt, 0, 1);
    if (this.growValue === 0) {
      this.growSpeed = GROW_SPEED;
    }

    this.ctx.save();

    this.ctx.translate(this.pos.x, this.pos.y);

    this.ctx.fillStyle = "darkgreen";
    this.ctx.fillRect(0, 0, 32, 32);
    this.grassinkas.forEach((grassinka) => this._drawGrassinka(grassinka));

    this.ctx.restore();
  }

  private debugPhysics() {
    this.ctx.fillStyle = "black";
    this.ctx.rect(
      this.bodyRect.x,
      this.bodyRect.y,
      this.bodyRect.w,
      this.bodyRect.h
    );
    this.ctx.stroke();
  }
}
