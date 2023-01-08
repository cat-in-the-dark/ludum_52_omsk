import { sceneManager } from "../lib/scene-manager";
import { GameScreen } from "./screens/game";
import { TitleScreen } from "./screens/title";
import type { IUpdateable } from "../lib/interfaces/updateable";
import type { SoundManager } from "./sound-manager";
import type { TexturesManager } from "./textures";

export class App implements IUpdateable {
  constructor(
    private ctx: CanvasRenderingContext2D,
    private hud: CanvasRenderingContext2D,
    private sm: SoundManager,
    private tm: TexturesManager
  ) {
    sceneManager.put("game", new GameScreen(ctx, tm));
    sceneManager.put("title", new TitleScreen(ctx, tm));
    sceneManager.set("game");
  }

  update(dt: number) {
    sceneManager.update(dt);
  }
}
