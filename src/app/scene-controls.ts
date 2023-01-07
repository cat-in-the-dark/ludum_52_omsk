import type { IScene } from "../lib/scene-manager";

export class SceneControls implements IScene {
  constructor(private ctx: CanvasRenderingContext2D) {
    // this.controllers = [];
  }

  activate(): void {
    //
  }
  update(dt: number): void {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.ctx.fillStyle = "green";
    this.ctx.fillRect(0, 0, 100, 100);
  }
  exit(): void {
    //
  }
}
