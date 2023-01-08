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
  btn?.addEventListener(
    "click",
    () => {
      btn.disabled = true;
      main();
    },
    false
  );

  console.log("WAITING");
});
