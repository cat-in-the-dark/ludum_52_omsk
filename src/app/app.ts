import { Game } from "./game";
import { setupSounds } from "./sounds";

function ready(fn: () => void) {
  if (document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

async function run(
  mainContext: CanvasRenderingContext2D,
  hudContext: CanvasRenderingContext2D,
) {
  const frameRate = 60;
  const sm = await setupSounds();
  const game = new Game(mainContext, hudContext, sm);
  const step = 1 / frameRate;
  let dt = 0;
  let last = -1;
  function loop(now: number) {
    if (last < 0) {
      last = now;
    }
    dt += Math.min(1, (now - last) / 1000);
    last = now;

    while (dt > step) {
      dt -= step;
      game.update(step);
    }
    game.draw(dt);

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

async function main() {
  const mainContext = getContext("ui-main");
  const hudContext = getContext("ui-hud");

  run(mainContext, hudContext);
}

function gamepadDebug() {
  window.addEventListener("gamepadconnected", (event) => {
    console.log("A gamepad connected:");
    console.log(event.gamepad);
  });

  window.addEventListener("gamepaddisconnected", (event) => {
    console.log("A gamepad disconnected:");
    console.log(event.gamepad);
  });
}

ready(() => {
  const btn = document.querySelector("button");
  btn?.addEventListener("click", () => {
    btn.disabled = true;
    main();
  }, false);

  gamepadDebug();

  console.log("WAITING");
});
