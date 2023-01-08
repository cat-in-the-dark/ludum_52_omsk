import { inputs } from "../lib/inputs";
import { App } from "./app";
import { setupSounds } from "./sounds";
import { setupTextures } from "./textures";
import type { IUpdateable } from "../lib/interfaces/updateable";

class FPS implements IUpdateable {
  private time = 0;
  private counter = 0;

  constructor(private ctx: CanvasRenderingContext2D) {
    this.draw(60);
  }

  update(dt: number) {
    this.counter += 1;
    this.time += dt;

    if (this.time > 1) {
      this.draw(Math.floor(this.counter / this.time));
      this.counter = 0;
      this.time = 0;
    }
  }

  private draw(n: number) {
    this.ctx.save();
    this.ctx.fillStyle = "green";
    this.ctx.fillRect(520, 475 - 26, 120, 30);

    this.ctx.fillStyle = "white";
    this.ctx.fillText(`${n} FPS`, 530, 475);
    this.ctx.restore();
  }
}

async function run(
  mainContext: CanvasRenderingContext2D,
  hudContext: CanvasRenderingContext2D
) {
  const sm = await setupSounds();
  const tm = await setupTextures();
  inputs.connect();
  const game = new App(mainContext, hudContext, sm, tm);
  let last = -1;
  const fps = new FPS(hudContext);

  function loop(now: number) {
    if (last < 0) {
      last = now;
    }
    const dt = Math.min(1, (now - last) / 1000);
    last = now;

    game.update(dt);
    inputs.update(dt);

    fps.update(dt);

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

function getContext(id: string) {
  const canvas = document.getElementById(id) as HTMLCanvasElement;
  if (!canvas) {
    throw new Error(`Canvas '${id}' not found`);
  }
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Cannot get mainContext");
  }
  context.font = "24px font";
  return context;
}

export async function main() {
  const mainContext = getContext("ui-main");
  const hudContext = getContext("ui-hud");

  run(mainContext, hudContext);
}
