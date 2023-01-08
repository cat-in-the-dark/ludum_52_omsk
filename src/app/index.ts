import { inputs } from "../lib/inputs";
import { App } from "./app";
import { setupSounds } from "./sounds";
import { setupTextures } from "./textures";

class FPS {
  private time = 0;
  private counter = 0;

  constructor(private ctx: CanvasRenderingContext2D) {}

  update(dt: number) {
    this.counter += 1;
    this.time += dt;

    if (this.time > 1) {
      this.draw(Math.floor(this.counter / this.time));
      this.counter = 0;
      this.time = 0;
    }
  }

  draw(n: number) {
    this.ctx.fillStyle = "green";
    this.ctx.fillRect(590, 8, 50, 32);

    this.ctx.fillStyle = "white";
    this.ctx.font = "24px serif";
    this.ctx.fillText(n.toString(), 600, 32);
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
  fps.draw(60);

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
  return context;
}

export async function main() {
  const mainContext = getContext("ui-main");
  const hudContext = getContext("ui-hud");

  run(mainContext, hudContext);
}
