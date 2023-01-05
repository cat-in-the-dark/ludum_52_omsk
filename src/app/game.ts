import type { SoundManager } from "./sound-manager";

export class Game {
  sm: SoundManager;

  constructor(sm: SoundManager) {
    this.sm = sm;
  }

  update(dt: number) {
    // TODO
  }
}