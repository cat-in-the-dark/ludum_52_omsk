import type { SoundManager } from "./sound-manager";

export class Game {
  constructor(
    private ctx: CanvasRenderingContext2D,
    private sm: SoundManager,
  ) {}

  update(dt: number) {
    // TODO
    console.log(dt);
    this.ctx.fillStyle = "green";
    this.ctx.fillRect(0,0,100,100); 
  }
}