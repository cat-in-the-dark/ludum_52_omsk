import type { SoundManager } from "./sound-manager";

export class Game {
  constructor(
    private ctx: CanvasRenderingContext2D,
    private hud: CanvasRenderingContext2D,
    private sm: SoundManager,
  ) { }

  draw(dt: number) {
    this.ctx.fillStyle = "green";
    this.ctx.fillRect(0, 0, 100, 100);

    this.hud.fillStyle = "blue";
    this.hud.fillRect(80, 80, 64, 64);
  }

  update(dt: number) {
    // TODO
  }
}