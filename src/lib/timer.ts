import type { IUpdateable } from "./interfaces/updateable";

export class Timer implements IUpdateable {
  private elapsed = 0;

  constructor(public time: number) {
    this.elapsed = time + 1;
  }

  get isPassed() {
    return this.elapsed >= this.time;
  }

  update(dt: number) {
    this.elapsed += dt;
  }

  reset() {
    this.elapsed = 0;
  }
}
