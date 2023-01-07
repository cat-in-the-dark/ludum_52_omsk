import { inputs } from "../lib/inputs";
import { Vec2 } from "../lib/vec2";
import {
  isArrows,
  isWASD,
  newArrowControls,
  newGampePadControls,
  newWasdControls,
} from "./controls";
import { Player } from "./player";
import type { IScene } from "../lib/scene-manager";

export class SceneControls implements IScene {
  private players: Map<string, Player> = new Map();

  constructor(private ctx: CanvasRenderingContext2D) {}

  activate(): void {
    //
  }

  update(dt: number): void {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.players.forEach((player) => player.update(dt));

    this.handleNewPlayer();
  }

  trySpawn(id: string, keys: Set<string>) {
    if (id === "keyboard" && !this.players.has("wasd") && isWASD(keys)) {
      console.log("Spawn WASD");
      this.players.set(
        "wasd",
        new Player(this.ctx, new Vec2(64, 64), newWasdControls(), "red")
      );
    } else if (
      id === "keyboard" &&
      !this.players.has("arrows") &&
      isArrows(keys)
    ) {
      console.log("Spawn ARROWS");
      this.players.set(
        "arrows",
        new Player(this.ctx, new Vec2(64, 64), newArrowControls(), "yellow")
      );
    } else if (id !== "keyboard" && !this.players.has(id)) {
      console.log("Spawn: ", id);
      this.players.set(
        id,
        new Player(this.ctx, new Vec2(64, 64), newGampePadControls(id), "green")
      );
    }
  }

  handleNewPlayer() {
    if (this.players.size >= 4) {
      return;
    }

    for (const [id, keys] of inputs.getPressed()) {
      if (keys.size !== 0) {
        this.trySpawn(id, keys);
      }
    }
  }

  exit(): void {
    //
  }
}
