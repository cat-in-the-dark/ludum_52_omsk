import { Game } from "./game";
import { setupSounds } from "./sounds";

function ready(fn: () => void) {
  if (document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

async function run(ctx: CanvasRenderingContext2D) {
  const sm = await setupSounds();
  const game = new Game(ctx, sm);
  const step = 1 / 60; // 60 FPS
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

async function main() {
  const btn = document.querySelector("button");
  if (btn) {
    btn.style.display = "none";
  }

  const canvas = document.querySelector("canvas");
  const ctx = canvas?.getContext("2d");
  if (canvas && ctx) {
    canvas.style.display = "block";
    run(ctx);
  }
}

ready(() => {
  document.querySelector("button")?.addEventListener("click", main, false);

  window.addEventListener("gamepadconnected", (event) => {
    console.log("A gamepad connected:");
    console.log(event.gamepad);
  });

  window.addEventListener("gamepaddisconnected", (event) => {
    console.log("A gamepad disconnected:");
    console.log(event.gamepad);
  });

  console.log("WAITING");
});
