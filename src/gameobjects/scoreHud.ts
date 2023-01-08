import { GameScreen, VIEWPORT } from "../app/screens/game";
import type { IUpdateable } from "../lib/interfaces/updateable";

export class ScoreHud implements IUpdateable {
  constructor(
    private ctx: CanvasRenderingContext2D,
    private gameScreen: GameScreen
  ) {}

  update(dt: number): void {
    let i = 0;
    this.ctx.save();
    this.ctx.translate(VIEWPORT.maxX + 8, 64);
    this.ctx.fillStyle = "white";
    for (const player of this.gameScreen.players.values()) {
      const score = Math.round(player.collectedGrass);
      this.ctx.drawImage(player.texture, 0, i * player.sizes.y);
      this.ctx.fillText(
        score.toString(),
        player.sizes.x + 8,
        (i + 0.5) * player.sizes.y + 12
      );
      i += 1;
    }

    this.ctx.restore();
  }
}
