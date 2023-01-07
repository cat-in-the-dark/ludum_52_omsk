import type { IUpdateable } from "../lib/interfaces/updateable";
import type { Vec2 } from "../lib/vec2";
import type { Controls } from "./controls";

export class Player implements IUpdateable {
  private width = 32;
  private height = 32;
  private speed = 128;

  constructor(
    private ctx: CanvasRenderingContext2D,
    private pos: Vec2,
    public controls: Controls,
    private color: string
  ) {}

  update(dt: number): void {
    const dir = this.controls.dir();
    this.pos = this.pos.add(dir.scale(dt * this.speed));

    this.draw();
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
  }
}
