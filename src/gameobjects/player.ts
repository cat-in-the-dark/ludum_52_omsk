import { Cooldown } from "../lib/cooldown";
import { easeInBack } from "../lib/easings";
import { TweenVec2 } from "../lib/tween";
import { Vec2 } from "../lib/vec2";
import type { Controls } from "../app/controls";
import type { IUpdateable } from "../lib/interfaces/updateable";

export class Player implements IUpdateable {
  private width = 32;
  private height = 32;
  private speed = 128;
  private dir: Vec2 = new Vec2(1, 0);
  private dashDist = 128;

  private dashTween = new TweenVec2(0.5, easeInBack);
  private dashCooldown = new Cooldown(2);

  constructor(
    private ctx: CanvasRenderingContext2D,
    private pos: Vec2,
    public controls: Controls,
    private color: string
  ) {}

  update(dt: number): void {
    if (this.dashTween.isActive) {
      // dashing
      this.pos = this.dashTween.value;
    } else {
      // just moving
      const dir = this.controls.dir();
      this.pos = this.pos.add(dir.scale(dt * this.speed));
      if (dir.sqrMagnitude > 0.01) {
        this.dir = dir; // save direction
      }
    }

    if (this.controls.dash() && this.dashCooldown.invoke()) {
      const target = this.pos.add(this.dir.scale(this.dashDist));
      this.dashTween.start(this.pos, target);
    }

    this.dashCooldown.update(dt);
    this.dashTween.update(dt);
    this.draw();
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
  }
}
