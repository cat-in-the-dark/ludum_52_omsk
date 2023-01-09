import { Blinker } from "../../lib/coroutines/blinker";
import { Cooldown } from "../../lib/coroutines/cooldown";
import { Timer } from "../../lib/coroutines/timer";
import { clampVec } from "../../lib/physics";
import { Rect } from "../../lib/rect";
import { easeInBack, easeOutBounce } from "../../lib/tween/easings";
import { TweenVec2 } from "../../lib/tween/tween-vec2";
import { Vec2 } from "../../lib/vec2";
import { VIEWPORT } from "../screens/game";
import type { IUpdateable } from "../../lib/interfaces/updateable";
import type { Controls, Dirs } from "../controls";
import type { Grass } from "./grass";

function mask(a: Vec2, b: Vec2, mask: Vec2) {
  return new Vec2(mask.x === 0 ? a.x : b.x, mask.y === 0 ? a.y : b.y);
}

export class Player implements IUpdateable {
  public sizes = new Vec2(48, 48);
  private speed = 128;
  private dirName: Dirs = "";
  private dir: Vec2 = new Vec2(0, 0);
  private dashDist = 128;
  private body: Rect = new Rect(
    4,
    4,
    this.sizes.x - 4 * 2,
    this.sizes.y - 4 * 2
  );

  private dasher: Player | null = null;
  private dashedDist = 32;
  private dashedTween = new TweenVec2(0.4, easeOutBounce);
  private blinker = new Blinker(0.05);
  private stunTimer = new Timer(2, 1000);

  private dashTween = new TweenVec2(0.5, easeInBack);
  private dashCooldown = new Cooldown(2);

  public collectedGrass = 0;

  constructor(
    private ctx: CanvasRenderingContext2D,
    public pos: Vec2,
    public controls: Controls,
    public texture: HTMLImageElement
  ) {}

  get bodyRect() {
    return new Rect(
      this.pos.x + this.body.x,
      this.pos.y + this.body.y,
      this.body.w,
      this.body.h
    );
  }

  collect(grass: Grass) {
    if (grass.isCollectable && !this.dashed) {
      this.collectedGrass += grass.collect();
    }
  }

  get dashing() {
    return this.dashTween.isActive;
  }

  get dashed() {
    return (
      this.dashedTween.isActive ||
      this.dasher !== null ||
      !this.stunTimer.isPassed
    );
  }

  dashedBy(dasher: Player) {
    if (this.dashed) {
      return;
    }

    this.dasher = dasher;
    this.blinker.start();
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
      this.stunTimer.reset();
      this.dasher = null;
    } else if (!this.stunTimer.isPassed) {
      // wait for stun
    } else {
      // just moving
      const [dir, dirName] = this.controls.dir();
      this.pos = this.pos.add(dir.scale(dt * this.speed));
      if (dir.sqrMagnitude > 0.01) {
        this.dirName = dirName;
        this.dir = dir; // save direction
      }

      this.blinker.stop();
    }

    if (!this.dashed && this.controls.dash() && this.dashCooldown.invoke()) {
      const target = this.pos.add(this.dir.scale(this.dashDist));
      this.dashTween.start(this.pos, target);
    }

    this.pos = clampVec(this.pos, VIEWPORT, this.sizes);

    this.dashCooldown.update(dt);
    this.dashTween.update(dt);
    this.dashedTween.update(dt);
    this.blinker.update(dt);
    this.stunTimer.update(dt);
    this.draw();
  }

  draw() {
    this.ctx.save();
    this.ctx.translate(this.pos.x, this.pos.y);
    this.ctx.translate(this.sizes.x / 2, this.sizes.x / 2);
    this.flip();
    this.ctx.translate(-this.sizes.x / 2, -this.sizes.x / 2);
    this.ctx.drawImage(this.texture, 0, 0);

    if (this.blinker.invoke()) {
      this.ctx.fillStyle = "red";
      this.ctx.fillRect(8, 8, 32, 32);
    }

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

  flip() {
    switch (this.dirName) {
      case "UP":
        // default
        break;
      case "DOWN":
        this.ctx.scale(1, -1);
        break;
      case "LEFT":
        this.ctx.rotate(-Math.PI / 2);
        break;
      case "RIGHT":
        this.ctx.rotate(Math.PI / 2);
        break;
      default:
        // nothing
        break;
    }
  }
}
