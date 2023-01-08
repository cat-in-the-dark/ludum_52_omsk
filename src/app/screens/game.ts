import { Player } from "../../gameobjects/player";
import { inputs } from "../../lib/inputs";
import { rectIsIntersect } from "../../lib/physics";
import { Vec2 } from "../../lib/vec2";
import {
  isArrows,
  isWASD,
  newArrowControls,
  newGampePadControls,
  newWasdControls,
} from "../controls";
import type { IScene } from "../../lib/scene-manager";

export class GameScreen implements IScene {
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
    this.updatePhisics();
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

  updatePhisics() {
    const list = [...this.players.values()];

    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const playerA = list[i];
        const playerB = list[j];
        if (playerA && playerB) {
          const bra = playerA.bodyRect;
          const brb = playerB.bodyRect;
          const intersect = rectIsIntersect(bra, brb);
          if (intersect) {
            this.collidePlayers(playerA, playerB);
          }
        }
      }

      // TODO: iterate field
    }
  }

  collidePlayers(lhs: Player, rhs: Player) {
    if (lhs.dashing && !rhs.dashing) {
      rhs.dashedBy(lhs);
    }
    if (!lhs.dashing && rhs.dashing) {
      lhs.dashedBy(rhs);
    }
    // else nothing ot do
  }

  exit(): void {
    //
  }
}
