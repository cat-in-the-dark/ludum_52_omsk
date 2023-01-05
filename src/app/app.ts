import { Game } from "./game";
import { setupSounds } from "./sounds";

function ready(fn: () => void) {
  if (document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

async function main() {
  const sm = await setupSounds();
  const game = new Game(sm);
  let lastRender = 0;
  function loop(timestamp: DOMHighResTimeStamp) {
    const dt = timestamp - lastRender;
    game.update(dt);
    lastRender = timestamp;
    window.requestAnimationFrame(loop);
  }
  window.requestAnimationFrame(loop);
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
