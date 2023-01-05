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
  let lastRender = 0;
  function loop(timestamp: DOMHighResTimeStamp) {
    const dt = timestamp - lastRender;
    game.update(dt);
    lastRender = timestamp;
    window.requestAnimationFrame(loop);
  }
  window.requestAnimationFrame(loop);
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
