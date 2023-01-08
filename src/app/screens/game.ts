import { Grass } from "../../gameobjects/grass";
import { Player } from "../../gameobjects/player";
import { ScoreHud } from "../../gameobjects/scoreHud";
import { inputs } from "../../lib/inputs";
import { Rect, rectIsIntersect } from "../../lib/physics";
import { Vec2 } from "../../lib/vec2";
import { range } from "../../utils/math";
import {
  isArrows,
  isWASD,
  newArrowControls,
  newGampePadControls,
  newWasdControls,
} from "../controls";
import type { IScene } from "../../lib/scene-manager";
import type { TexturesManager } from "../textures";

export const VIEWPORT = new Rect(0, 0, 480, 480);

export class GameScreen implements IScene {
  public players: Map<string, Player> = new Map();
  private grass: Array<Grass> = [];
  private scoreHud: ScoreHud = new ScoreHud(this.ctx, this);

  constructor(
    private ctx: CanvasRenderingContext2D,
    private tm: TexturesManager
  ) {}

  activate(): void {
    this.players = new Map();
    this.grass = range(0, 15).flatMap((x) =>
      range(0, 15).map(
        (y) => new Grass(this.ctx, new Vec2(x * 32, y * 32), 0.8)
      )
    );
  }

  update(dt: number): void {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.updateGrass(dt);

    this.players.forEach((player) => player.update(dt));

    this.scoreHud.update(dt);

    this.handleNewPlayer();
    this.updatePhisics();
  }

  updateGrass(dt: number) {
    this.grass.forEach((g) => g.update(dt));
  }

  private nextTrackTexture() {
    return this.tm.tractors[this.players.size] || this.tm.tractors[0];
  }

  trySpawn(id: string, keys: Set<string>) {
    if (id === "keyboard" && !this.players.has("wasd") && isWASD(keys)) {
      console.log("Spawn WASD");
      this.players.set(
        "wasd",
        new Player(
          this.ctx,
          new Vec2(64, 64),
          newWasdControls(),
          this.nextTrackTexture()
        )
      );
    } else if (
      id === "keyboard" &&
      !this.players.has("arrows") &&
      isArrows(keys)
    ) {
      console.log("Spawn ARROWS");
      this.players.set(
        "arrows",
        new Player(
          this.ctx,
          new Vec2(64, 64),
          newArrowControls(),
          this.nextTrackTexture()
        )
      );
    } else if (id !== "keyboard" && !this.players.has(id)) {
      console.log("Spawn: ", id);
      this.players.set(
        id,
        new Player(
          this.ctx,
          new Vec2(64, 64),
          newGampePadControls(id),
          this.nextTrackTexture()
        )
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
      const playerA = list[i];
      if (!playerA) {
        continue;
      }

      for (let j = i + 1; j < list.length; j++) {
        const playerB = list[j];
        if (!playerB) {
          continue;
        }

        const bra = playerA.bodyRect;
        const brb = playerB.bodyRect;
        const intersect = rectIsIntersect(bra, brb);
        if (intersect) {
          this.collidePlayers(playerA, playerB);
        }
      }

      this.grass.forEach((g) => {
        // TODO: maybe just get a tile??
        if (rectIsIntersect(g.bodyRect, playerA.bodyRect)) {
          playerA.collect(g);
        }
      });
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
