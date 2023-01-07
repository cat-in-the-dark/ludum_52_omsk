import { sceneManager } from "../lib/scene-manager";
import { SceneControls } from "./scene-controls";
import type { IUpdateable } from "../lib/interfaces/updateable";
import type { SoundManager } from "./sound-manager";

export class Game implements IUpdateable {
  constructor(
    private ctx: CanvasRenderingContext2D,
    private hud: CanvasRenderingContext2D,
    private sm: SoundManager,
  ) { 
    sceneManager.put("controls", new SceneControls(ctx));
    sceneManager.set("controls");
  }

  update(dt: number) {
    sceneManager.update(dt);
  }
}