import { inputs } from "../../lib/inputs";
import { IScene, sceneManager } from "../../lib/scene-manager";
import type { TexturesManager } from "../textures";

export class TitleScreen implements IScene {
  constructor(
    private ctx: CanvasRenderingContext2D,
    private tm: TexturesManager
  ) {}

  activate(): void {
    //
  }
  update(dt: number): void {
    this.ctx.fillStyle = "yellow";
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.drawImage(this.tm.logo, 0, 0);

    if (inputs.anyPressed()) {
      sceneManager.set("game");
    }
  }
  exit(): void {
    //
  }
}
