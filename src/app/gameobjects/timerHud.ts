import { VIEWPORT } from "../screens/game";
import type { Timer } from "../../lib/coroutines/timer";
import type { IUpdateable } from "../../lib/interfaces/updateable";

export class TimerHud implements IUpdateable {
  constructor(private ctx: CanvasRenderingContext2D, private timer: Timer) {}

  update(dt: number): void {
    const time = this.timer.value.toFixed(1);

    this.ctx.save();
    this.ctx.translate(VIEWPORT.maxX + 20, 32);
    this.ctx.fillStyle = "white";
    this.ctx.fillText(time.toString(), 32, 8);

    this.ctx.beginPath();
    this.ctx.arc(0, 0, 16, 0, 2 * Math.PI * this.timer.progress);
    this.ctx.fillStyle = "white";
    this.ctx.fill();
    this.ctx.strokeStyle = "white";
    this.ctx.stroke();

    this.ctx.restore();
  }
}
