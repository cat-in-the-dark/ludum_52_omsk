import { GameScreen, VIEWPORT } from "../app/screens/game";
import type { IUpdateable } from "../lib/interfaces/updateable";
import type { Timer } from "../lib/timer";

export class TimerHud implements IUpdateable {
  constructor(private ctx: CanvasRenderingContext2D, private timer: Timer) {}

  update(dt: number): void {
    this.ctx.save();
    this.ctx.translate(VIEWPORT.maxX + 8, 32);
    this.ctx.fillStyle = "white";

    const time = this.timer.value.toFixed(1);

    this.ctx.fillText(time.toString(), 8, 8);

    this.ctx.restore();
  }
}
