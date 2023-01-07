import type { IUpdateable } from "../lib/interfaces/updateable";
import type { SoundManager } from "./sound-manager";

export class Game implements IUpdateable {
  constructor(
    private ctx: CanvasRenderingContext2D,
    private hud: CanvasRenderingContext2D,
    private sm: SoundManager,
  ) { }

  draw(dt: number) {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0,0,this.ctx.canvas.width, this.ctx.canvas.height);

    this.ctx.fillStyle = "green";
    this.ctx.fillRect(0, 0, 100, 100);

    this.hud.fillStyle = "blue";
    this.hud.fillRect(80, 80, 64, 64);
  }

  update(dt: number) {
    // TODO
  }
}