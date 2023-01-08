import { Grass } from "../gameobjects/grass";
import { sceneManager } from "../lib/scene-manager";
import { range } from "../utils/math";
import { SceneControls } from "./scene-controls";
import type { IUpdateable } from "../lib/interfaces/updateable";
import type { SoundManager } from "./sound-manager";

export class Game implements IUpdateable {
  constructor(
    private ctx: CanvasRenderingContext2D,
    private hud: CanvasRenderingContext2D,
    private sm: SoundManager
  ) {
    sceneManager.put("controls", new SceneControls(ctx));
    sceneManager.set("controls");
  }

  private testGrass = range(0, 15).flatMap((x) =>
    range(0, 15).map((y) => new Grass(this.ctx, x * 32, y * 32))
  );

  update(dt: number) {
    // this.ctx.scale(0.5, 0.5);
    sceneManager.update(dt);
    this.testGrass.forEach((grass) => grass.update(dt));
    // this.ctx.resetTransform();
  }
}
