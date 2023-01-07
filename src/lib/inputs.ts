import type { IUpdateable } from "./interfaces/updateable";

class Inputs implements IUpdateable {
  private state: Map<string, Map<string, boolean>> = new Map();

  connect() {
    this.state.set("keyboard", new Map());

    window.addEventListener("keyup", (ev) => {
      const kb = this.state.get("keyboard");
      kb?.set(ev.code, false);
    });
    window.addEventListener("keydown", (ev) => {
      const kb = this.state.get("keyboard");
      kb?.set(ev.code, true);
    });

    window.addEventListener("gamepadconnected", (event) => {
      console.log("A gamepad connected:");
      console.log(event.gamepad);

      this.state.set(event.gamepad.id, new Map());
    });

    window.addEventListener("gamepaddisconnected", (event) => {
      console.log("A gamepad disconnected:");
      console.log(event.gamepad);

      this.state.delete(event.gamepad.id);
    });
  }

  isPressed(code: string, id = "keyboard") {
    return this.state.get(id)?.get(code) || false;
  }

  update(dt: number) {
    if (!document.hasFocus()) {
      this.state.forEach((src) => {
        src.clear();
      });
      return;
    }
    const gamepads = navigator.getGamepads();
    gamepads.forEach((gp) => {
      if (gp) {
        const gpState = this.state.get(gp.id);
        gpState?.set("X", gp.buttons[2]?.pressed || false);
        gpState?.set("Y", gp.buttons[3]?.pressed || false);
        gpState?.set("B", gp.buttons[1]?.pressed || false);
        gpState?.set("A", gp.buttons[0]?.pressed || false);

        gpState?.set("ArrowLeft", gp.buttons[14]?.pressed || false);
        gpState?.set("ArrowRight", gp.buttons[15]?.pressed || false);
        gpState?.set("ArrowUp", gp.buttons[12]?.pressed || false);
        gpState?.set("ArrowDown", gp.buttons[13]?.pressed || false);
      }
    });

    this.debug();
  }

  debug() {
    this.state.forEach((src, name) => {
      src.forEach((isPressed, code) => {
        if (isPressed) {
          console.log(name, code);
        }
      });
    });
  }
}

export const inputs = new Inputs();
