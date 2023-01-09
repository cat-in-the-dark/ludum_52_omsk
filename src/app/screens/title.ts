import { Cooldown } from "../../lib/coroutines/cooldown";
import { inputs } from "../../lib/inputs";
import { IScene, sceneManager } from "../../lib/scene-manager";
import type { TexturesManager } from "../textures";

export class TitleScreen implements IScene {
  constructor(
    private ctx: CanvasRenderingContext2D,
    private tm: TexturesManager
  ) {}

  private timer = new Cooldown(2);

  activate(): void {
    this.timer.reset();
  }
  update(dt: number): void {
    this.ctx.save();
    this.ctx.drawImage(this.tm.logo, 0, 0);
    this.ctx.restore();

    if (inputs.anyPressed() || this.timer.invoke()) {
      sceneManager.set("game");
    }

    this.timer.update(dt);
  }
  exit(): void {
    //
  }
}
