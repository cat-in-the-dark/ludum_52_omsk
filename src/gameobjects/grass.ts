import { Vec2 } from "../lib/vec2";
import { clamp, randomBetween, range } from "../utils/math";
import type { IUpdateable } from "../lib/interfaces/updateable";

interface Grassinka {
  pos: Vec2;
  color: string;
  timeShift: number;
}

const GROW_SPEED = 0.1;
const MIN_GROW_VALUE = GROW_SPEED * 2;
const COLLECT_SPEED = -1.5;

export class Grass implements IUpdateable {
  constructor(
    private ctx: CanvasRenderingContext2D,
    private x: number,
    private y: number,
    private growSpeed: number = GROW_SPEED
  ) {}

  public growValue = 0;

  private time = 0;

  private grassinkas: Array<Grassinka> = range(0, 12).map(() => ({
    // pos: new Vec2(randomBetween(0, 28), randomBetween(8, 30)),
    pos: new Vec2(randomBetween(-2, 26), randomBetween(2, 32)),
    color: `rgb(${randomBetween(40, 60)}, ${randomBetween(190, 210)}, 0)`,
    timeShift: randomBetween(0, 1),
  }));

  collect(): number {
    if (this.growSpeed > 0) {
      this.growSpeed = COLLECT_SPEED;
      return this.growValue >= MIN_GROW_VALUE ? this.growValue : 0;
    }
    return 0;
  }

  _drawGrassinka(g: Grassinka) {
    this.ctx.save();
    this.ctx.translate(g.pos.x, g.pos.y);
    this.ctx.strokeStyle = g.color;
    const time = g.timeShift + this.time;

    const upperPoint = {
      x: (2 + 3 * Math.sin(2 * time)) * this.growValue,
      y: -16 * this.growValue + 0 * Math.sin(3 * time),
    };

    const drawSegment = (stX: number, stY: number) => {
      this.ctx.beginPath();
      this.ctx.moveTo(stX, stY);
      this.ctx.quadraticCurveTo(
        1 + 3 * this.growValue,
        -2 - 6 * this.growValue,
        upperPoint.x,
        upperPoint.y
      );
      this.ctx.stroke();
    };

    drawSegment(0, 0);
    drawSegment(4, 0);

    this.ctx.restore();
  }

  update(dt: number) {
    this.time += dt;
    this.growValue = clamp(this.growValue + this.growSpeed * dt, 0, 1);
    this.growValue;

    this.ctx.save();

    this.ctx.translate(this.x, this.y);

    this.ctx.fillStyle = "darkgreen";
    this.ctx.fillRect(0, 0, 32, 32);
    this.grassinkas.forEach((grassinka) => this._drawGrassinka(grassinka));

    this.ctx.restore();
  }
}
