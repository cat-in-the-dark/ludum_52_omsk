import { ScoreHud } from "../gameobjects/scoreHud";
import { sceneManager } from "../lib/scene-manager";
import { GameScreen } from "./screens/game";
import { ResultsScreen } from "./screens/results";
import { TitleScreen } from "./screens/title";
import type { IUpdateable } from "../lib/interfaces/updateable";
import type { SoundManager } from "./sound-manager";
import type { TexturesManager } from "./textures";

export class App implements IUpdateable {
  private scoreHud: ScoreHud;

  constructor(
    private ctx: CanvasRenderingContext2D,
    private hud: CanvasRenderingContext2D,
    private sm: SoundManager,
    private tm: TexturesManager
  ) {
    const game = new GameScreen(ctx, tm);
    sceneManager.put("game", game);
    sceneManager.put("title", new TitleScreen(ctx, tm));
    sceneManager.set("game");
    sceneManager.put("results", new ResultsScreen(ctx, tm));

    this.scoreHud = new ScoreHud(this.ctx, game);
  }

  update(dt: number) {
    sceneManager.update(dt);

    if (
      sceneManager.currentName === "game" ||
      sceneManager.currentName === "results"
    ) {
      this.scoreHud.update(dt);
    }
  }
}
