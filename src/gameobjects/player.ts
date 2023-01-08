import { Cooldown } from "../lib/cooldown";
import { easeInBack, easeOutBounce, easeOutExpo } from "../lib/easings";
import { Rect } from "../lib/physics";
import { TweenVec2 } from "../lib/tween";
import { Vec2 } from "../lib/vec2";
import type { Controls } from "../app/controls";
import type { IUpdateable } from "../lib/interfaces/updateable";

function mask(a: Vec2, b: Vec2, mask: Vec2) {
  return new Vec2(mask.x === 0 ? a.x : b.x, mask.y === 0 ? a.y : b.y);
}

export class Player implements IUpdateable {
  public sizes = new Vec2(32, 32);
  private speed = 128;
  private dir: Vec2 = new Vec2(1, 0);
  private dashDist = 128;
  private body: Rect = new Rect(0, 0, 32, 32);

  private dasher: Player | null = null;
  private dashedDist = 32;
  private dashedTween = new TweenVec2(0.3, easeOutBounce);

  private dashTween = new TweenVec2(0.5, easeInBack);
  private dashCooldown = new Cooldown(2);

  constructor(
    private ctx: CanvasRenderingContext2D,
    public pos: Vec2,
    public controls: Controls,
    private color: string
  ) {}

  get bodyRect() {
    return new Rect(
      this.pos.x + this.body.x,
      this.pos.y + this.body.y,
      this.body.w,
      this.body.h
    );
  }

  get dashing() {
    return this.dashTween.isActive;
  }

  get dashed() {
    return this.dashedTween.isActive || this.dasher !== null;
  }

  dashedBy(dasher: Player) {
    if (this.dashed) {
      return;
    }

    this.dasher = dasher;
  }

  private slideAfterDash(dir: Vec2) {
    const vec = dir.scale(this.dashedDist);
    const target = this.pos.add(vec);
    this.dashedTween.start(this.pos, target);
  }

  update(dt: number): void {
    if (this.dashTween.isActive) {
      this.pos = this.dashTween.value;
    } else if (this.dashedTween.isActive) {
      this.pos = this.dashedTween.value;
    } else if (this.dasher && this.dasher.dashing) {
      const delta = this.dasher.dir.mul(this.dasher.sizes);
      const newPos = mask(this.pos, this.dasher.pos.add(delta), delta);
      this.pos = newPos;
    } else if (this.dasher && !this.dasher.dashing) {
      this.slideAfterDash(this.dasher.dir);
      this.dasher = null;
    } else {
      // just moving
      const dir = this.controls.dir();
      this.pos = this.pos.add(dir.scale(dt * this.speed));
      if (dir.sqrMagnitude > 0.01) {
        this.dir = dir; // save direction
      }
    }

    if (!this.dashed && this.controls.dash() && this.dashCooldown.invoke()) {
      const target = this.pos.add(this.dir.scale(this.dashDist));
      this.dashTween.start(this.pos, target);
    }

    this.dashCooldown.update(dt);
    this.dashTween.update(dt);
    this.dashedTween.update(dt);
    this.draw();
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.pos.x, this.pos.y, this.sizes.x, this.sizes.y);
  }
}