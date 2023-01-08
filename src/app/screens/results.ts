import { inputs } from "../../lib/inputs";
import { IScene, sceneManager } from "../../lib/scene-manager";
import { Timer } from "../../lib/timer";
import { results } from "../results-table";
import { VIEWPORT } from "./game";
import type { TexturesManager } from "../textures";

export class ResultsScreen implements IScene {
  constructor(
    private ctx: CanvasRenderingContext2D,
    private tm: TexturesManager
  ) {}

  private timer = new Timer(2, 0);

  activate(): void {
    this.timer.reset();
  }
  update(dt: number): void {
    this.ctx.save();
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.ctx.fillStyle = "white";
    this.ctx.fillText("POTRA4EHO", 240, 128);
    this.ctx.restore();

    if (this.timer.isPassed && inputs.anyPressed()) {
      sceneManager.set("game");
    }

    this.timer.update(dt);
  }

  exit(): void {
    //
  }
}
