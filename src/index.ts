import { main } from "./app/index";

function ready(fn: () => void) {
  if (document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

ready(() => {
  const btn = document.querySelector("button");
  const stage = document.getElementById("stage");
  if (!stage) {
    return;
  }
  btn?.addEventListener(
    "click",
    () => {
      stage.style.display = "block";
      btn.disabled = true;
      btn.remove();
      main();
    },
    false
  );

  console.log("WAITING");
});
